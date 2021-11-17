import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserInfo, UserInfoDto} from "./model/userInfo.model";
import {environment} from "../../environments/environment";
import {map, tap} from "rxjs/operators";
import {Authority} from "../auth/model/authority.model";

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserInfo(): Observable<UserInfo> {
    const url = `${environment.suchDogeApi}/me`;
    return this.http.get<UserInfoDto>(url)
      .pipe(
        tap(console.log),
        map(userInfoDto => this.userInfoDtoToUserInfo(userInfoDto)),
        tap(console.log)
      );
  }

  private userInfoDtoToUserInfo(dto: UserInfoDto) {
    return new UserInfo(
      dto.username,
      dto.email,
      dto.publicKey,
      new Date(dto.enabledAt),
      dto.authorities.map(x => x.authority as Authority)
    )
  }
}
