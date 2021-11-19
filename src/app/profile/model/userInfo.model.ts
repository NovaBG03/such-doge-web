import {Authority} from "../../auth/model/authority.model";

export class UserInfo {
  constructor(public username: string,
              public email: string,
              public publicKey: string,
              public enabledAt: Date | null,
              public authorities: Authority[]) {
  }
}

export interface UserInfoDto {
  username: string,
  email: string,
  publicKey: string,
  enabledAt: string,
  authorities: { authority: string }[]
}

export interface UserInfoUpdateDto {
  email?: string,
  publicKey?: string,
}
