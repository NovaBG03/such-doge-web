import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, concatMap, map} from "rxjs/operators";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {DogeUser} from "./model/user.model";
import {Router} from "@angular/router";
import {AuthTokens} from "./model/jwt.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<DogeUser | null>(null);
  private logOutTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
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

  login(username: string, password: string): Observable<DogeUser> {
    const url = `${environment.suchDogeApi}/login`;
    const body = {username, password};

    return this.http.post(url, body, {observe: "response"})
      .pipe(
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

  autoLogin(): void {
    const refreshToken = localStorage.getItem(environment.refreshTokenKey);

    if (!refreshToken) {
      localStorage.removeItem(environment.authTokenKey);
      return;
    }

    this.refreshAccess(refreshToken).subscribe();
  }

  logout(): void {
    this.user.next(null);
    localStorage.removeItem(environment.authTokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    if (this.logOutTimeout) {
      clearTimeout(this.logOutTimeout);
      this.logOutTimeout = null;
    }
    this.router.navigate(['/']);
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

    this.user.next(user);
    localStorage.setItem(environment.authTokenKey, authToken)
    localStorage.setItem(environment.refreshTokenKey, refreshToken)
    this.autoLogout(user);

    return user;
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
