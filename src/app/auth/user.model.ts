export class DogeUser {
  constructor(public username: string,
              public authorities: Authority[],
              public issuedAt: Date,
              public expiration: Date) {
  }

  get isExpired(): boolean {
    return this.secondsUntilExpiration <= 0;
  }

  get secondsUntilExpiration(): number {
    return this.expiration.getTime() - new Date().getTime();
  }
}

export enum Authority {
  User = 'ROLE_USER',
  Moderator = 'ROLE_MODERATOR',
  Admin = 'ROLE_ADMIN'
}
