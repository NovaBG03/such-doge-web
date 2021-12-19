import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, map, tap} from "rxjs/operators";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {DogeUser} from "./model/user.model";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<DogeUser | null>(null);
  private logOutTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
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

  login(username: string, password: string): Observable<DogeUser> {
    const url = `${environment.suchDogeApi}/login`;
    const body = {username, password};
    return this.http.post(url, body, {observe: "response"})
      .pipe(
        tap(resp => console.log(resp)),
        map(resp => {
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

          return this.authenticate(authToken, refreshToken)
        }),
        catchError(err => {
          console.log(err);
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
    let authToken = localStorage.getItem(environment.authTokenKey);
    const refreshToken = localStorage.getItem(environment.refreshTokenKey);

    if (!refreshToken) {
      return;
    }

    if (!authToken) {
      authToken = this.getNewAuthToken(refreshToken);
      if (!authToken) {
        localStorage.removeItem(environment.refreshTokenKey);
        return;
      }
    }

    let user = new DogeUser(authToken, refreshToken);
    if (user.isExpired) {
      authToken = this.getNewAuthToken(refreshToken);
      if (!authToken) {
        localStorage.removeItem(environment.authTokenKey);
        localStorage.removeItem(environment.refreshTokenKey);
        return;
      }
      user = new DogeUser(authToken, refreshToken);
    }

    this.user.next(user);
    this.autoLogout(user);
  }

  logout(): void {
    this.user.next(null);
    localStorage.removeItem(environment.authTokenKey);
    if (this.logOutTimeout) {
      clearTimeout(this.logOutTimeout);
      this.logOutTimeout = null;
    }
    this.router.navigate(['/']);
  }

  private autoLogout(user: DogeUser): void {
    this.logOutTimeout = setTimeout(
      () => {
        const authToken = this.getNewAuthToken(user.refreshToken);
        if (!authToken) {
          localStorage.removeItem(environment.authTokenKey);
          localStorage.removeItem(environment.refreshTokenKey);
          this.logout();
          return;
        }
        user = new DogeUser(authToken, user.refreshToken);

      },
      user.secondsUntilExpiration
    );
  }

  private authenticate(authToken: string, refreshToken: string): DogeUser {
    const user = new DogeUser(authToken, refreshToken);

    if (user.isExpired) {
      throw new Error(`JWT is expired!`);
    }

    this.user.next(user);
    localStorage.setItem(environment.authTokenKey, authToken)
    localStorage.setItem(environment.refreshTokenKey, authToken)
    this.autoLogout(user);

    return user;
  }

  private getNewAuthToken(refreshToken: string): string | null {
    return "";
  }
}
