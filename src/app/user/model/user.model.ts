import {Authority} from "../../auth/model/authority.model";

export class UserInfo {
  constructor(public username: string,
              public email: string,
              public publicKey: string,
              public enabledAt: Date | null,
              public authorities: Authority[]) {
  }
}

export interface UserAchievements {
  username: string,
  memesUploaded: number,
  donationsReceived: number,
  donationsSent: number
}
