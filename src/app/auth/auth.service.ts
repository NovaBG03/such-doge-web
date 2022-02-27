import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, concatMap, map, tap} from "rxjs/operators";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {DogeUser} from "./model/user.model";
import {Router} from "@angular/router";
import {AuthTokens} from "./model/jwt.model";
import {NotificationService} from "../notification-panel/notification.service";
import {EmailNotificationComponent} from "../notification-panel/notifications/email-notification/email-notification.component";
import {NotificationCategory} from "../notification-panel/model/notification.model";
import {InfoNotificationComponent} from "../notification-panel/notifications/info-notification/info-notification.component";
import {RxStompService} from "@stomp/ng2-stompjs";

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<DogeUser | null>(null);
  autoLoginFinished = new BehaviorSubject(false);
  private logOutTimeout: any;

  constructor(private http: HttpClient,
              private router: Router,
              private stompService: RxStompService,
              private notificationService: NotificationService) {
  }

  register(username: string, email: string, password: string): Observable<any> {
    const url = `${environment.suchDogeApi}/register`;
    const body = {username, email, password};
    return this.http.post(url, body, {observe: "response"})
      .pipe(
        catchError(err => {
          let message = 'Something went wrong!';
          switch (err.error.message) {
            case 'DOGE_USER_USERNAME_EXISTS':
              message = `User ${username} already exists!`;
              break;
            case 'DOGE_USER_EMAIL_EXISTS':
              message = `There is already user with email ${email}`;
              break;
            case 'DOGE_USER_USERNAME_INVALID':
              message = `Not a valid username: ${username}`;
          }

          return throwError(message);
        })
      )
  }

  activate(token: string): Observable<any> {
    const url = `${environment.suchDogeApi}/activate/${token}`;
    const body = {};
    return this.http.post(url, body, {observe: "response"})
      .pipe(
        catchError(err => {
          let message = 'Invalid or expired token!';

          // switch (err.error.message) {
          //   case 'ERROR':
          //     message = 'mess';
          //     break;
          // }

          return throwError(message);
        })
      );
  }

  requestActivationLink(): Observable<number> {
    const url = `${environment.suchDogeApi}/requestActivation`;
    const body = {};
    return this.http.post<{ secondsTillNextRequest: number }>(url, body)
      .pipe(
        map(res => res.secondsTillNextRequest),
        catchError(err => {
          let message: string | number = 'Something went wrong!';

          if (err.error.message === 'USER_ALREADY_ENABLED') {
            this.refresh();
            message = 'Your account is already enabled';
          } else if (err.error.message.startsWith('CAN_NOT_SENT_NEW_TOKEN_SECONDS_LEFT_')) {
            let secondsLeft = +err.error.message.substr('CAN_NOT_SENT_NEW_TOKEN_SECONDS_LEFT_'.length);
            message = secondsLeft;
          }
          return throwError(message);
        })
      );
  }

  refreshAccess(refreshToken: string): Observable<DogeUser> {
    const url = `${environment.suchDogeApi}/refresh/${refreshToken}`;
    const body = {};
    return this.http.post(url, body, {observe: "response"}).pipe(
      map(resp => {
        const {authToken, refreshToken} = AuthService.getTokens(resp);
        const user = this.authenticate(authToken, refreshToken);
        if (user instanceof DogeUser) {
          return user;
        }
        throw new Error("REFRESH_TOKEN_INVALID");
      }),
      catchError(err => {
        switch (err.error.message) {
          case 'REFRESH_TOKEN_INVALID':
            this.logout();
            return throwError('Invalid or expired authentication!');
        }
        return throwError(err);
      })
    );
  }

  refresh(): void {
    const refreshToken = this.user.getValue()?.refreshToken;
    if (refreshToken) {
      this.refreshAccess(refreshToken).subscribe();
    }
  }

  login(username: string, password: string): Observable<DogeUser> {
    const url = `${environment.suchDogeApi}/login`;
    const body = {username, password};

    return this.http.post(url, body, {observe: "response"})
      .pipe(
        tap(() => this.notificationService.clearLoadedNotifications()),
        map(resp => {
          const {authToken, refreshToken} = AuthService.getTokens(resp);
          return this.authenticate(authToken, refreshToken);
        }),
        concatMap(userOrRefreshToken => {
          if (userOrRefreshToken instanceof DogeUser) {
            return of(userOrRefreshToken);
          }
          return this.refreshAccess(userOrRefreshToken);
        }),
        catchError(err => {
          let message = 'Something went wrong!';

          switch (err.status) {
            case 403:
              message = 'Invalid username or password';
              break;
          }

          return throwError(message);
        })
      );
  }

  logout(): void {
    this.user.next(null);
    localStorage.removeItem(environment.authTokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem(environment.newRequestDateKey);
    if (this.logOutTimeout) {
      clearTimeout(this.logOutTimeout);
      this.logOutTimeout = null;
    }

    this.notificationService.stopListening();
    this.notificationService.clearLoadedNotifications();

    this.stompService.deactivate();
    this.notificationService.pushNotification({
          component: InfoNotificationComponent,
          category: NotificationCategory.Info,
          title: 'You have been logged out',
          message: 'Enjoy :)'
        });
    this.router.navigate(['/']);
  }

  autoLogin(): void {
    const refreshToken = localStorage.getItem(environment.refreshTokenKey);

    if (!refreshToken) {
      localStorage.removeItem(environment.authTokenKey);
      this.autoLoginFinished.next(true)
      return;
    }

    this.refreshAccess(refreshToken)
      .subscribe(
        () => this.autoLoginFinished.next(true),
        err => this.autoLoginFinished.next(true));
  }

  private autoLogout(user: DogeUser): void {
    this.logOutTimeout = setTimeout(
      () => {
        const refreshToken = localStorage.getItem(environment.refreshTokenKey);
        if (!refreshToken) {
          this.logout();
          return;
        }
        this.refreshAccess(refreshToken).subscribe();
      },
      user.secondsUntilExpiration
    );
  }

  private authenticate(authToken: string, refreshToken: string): DogeUser | string {
    const user = new DogeUser(authToken, refreshToken);

    if (user.isExpired) {
      return refreshToken;
    }

    localStorage.setItem(environment.authTokenKey, authToken)
    localStorage.setItem(environment.refreshTokenKey, refreshToken)
    this.autoLogout(user);
    this.user.next(user);

    this.checkAccountStatus(user);
    this.stompService.activate();
    this.notificationService.listenForNotifications();

    return user;
  }

  private checkAccountStatus(user: DogeUser | null) {
    if (user?.isNotConfirmed) {
      this.notificationService.pushNotification({
            component: EmailNotificationComponent,
            category: NotificationCategory.Danger,
            title: 'Email is not confirmed',
            message: 'Please confirm your email to access all of the site\'s functionality!'
          });
    } else {
      this.notificationService.removeEmailConfirmation();
    }
  }

  private static getTokens(resp: HttpResponse<Object>): AuthTokens {
    const authHeader = resp.headers.get(environment.authHeader);
    const authToken = authHeader?.substr(environment.authPrefix.length);
    if (!authToken) {
      throw new Error(`${environment.authHeader} header missing!`);
    }

    const refreshHeader = resp.headers.get(environment.refreshHeader);
    const refreshToken = refreshHeader?.substr(environment.refreshPrefix.length);
    if (!refreshToken) {
      throw new Error(`${environment.refreshHeader} header missing!`);
    }

    return {authToken, refreshToken};
  }
}
