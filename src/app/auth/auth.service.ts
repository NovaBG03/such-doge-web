import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {BehaviorSubject, Observable} from "rxjs";
import {Authority, DogeUser} from "./user.model";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<DogeUser | null>(null);
  private logOutTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  login(username: string, password: string): Observable<DogeUser> {
    const url = `${environment.suchDogeApi}/login`;
    const body = {username, password};
    return this.http.post(url, body, {observe: "response"})
      .pipe(
        map(resp => this.authenticate(resp.headers.get(environment.authHeader)))
      );
  }

  autoLogin(): void {
    const token = localStorage.getItem(environment.authTokenKey);

    if (!token) {
      return;
    }

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
