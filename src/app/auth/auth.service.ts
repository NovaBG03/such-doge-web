import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Authority, DogeUser} from "./user.model";
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
        map(resp => this.authenticate(resp.headers.get(environment.authHeader))),
        catchError(err => {
          switch (err.status) {
            case 403:
              err.message = 'Invalid username or password';
              break;
            default:
              err.message = 'Something went wrong!';
              break;
          }
          return throwError(err);
        })
      );
  }

  autoLogin(): void {
    const token = localStorage.getItem(environment.authTokenKey);

    if (!token) {
      return;
    }

    /* todo
    instead of checking token expiration
    send request to get new updated token
     */

    const jwt = this.parseJwt(token);
    const user = this.jwtToUser(jwt);
    if (!user.isExpired) {
      this.user.next(user);
      this.autoLogout(user.secondsUntilExpiration);
    }
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

  private autoLogout(secondsUntilExpiration: number): void {
    this.logOutTimeout = setTimeout(
      () => this.logout(),
      secondsUntilExpiration
    );
  }

  private authenticate(authHeader: string | null): DogeUser {
    const token = authHeader?.substr(environment.authPrefix.length);
    if (!token) {
      throw new Error(`${environment.authPrefix} header missing!`);
    }

    const jwt = this.parseJwt(token);
    const user = this.jwtToUser(jwt);

    if (user.isExpired) {
      throw new Error(`JWT is expired!`);
    }

    this.user.next(user);
    localStorage.setItem(environment.authTokenKey, JSON.stringify(token))
    this.autoLogout(user.secondsUntilExpiration);

    return user;
  }

  private parseJwt(token: string): Jwt {
    const base64Url = token.split('.')[1];

    const base64 = base64Url.replace(/-/g, '+')
      .replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(atob(base64).split('')
      .map(x => '%' + ('00' + x.charCodeAt(0).toString(16)).slice(-2))
      .join(''));

    return JSON.parse(jsonPayload);
  }

  private jwtToUser(jwt: Jwt) {
    return new DogeUser(
      jwt.sub,
      jwt.authorities.map(x => x.authority as Authority),
      new Date(jwt.iat * 1000),
      new Date(jwt.exp * 1000)
    );
  }
}

interface Jwt {
  sub: string;
  authorities: { authority: string }[];
  iat: number;
  exp: number;
}
