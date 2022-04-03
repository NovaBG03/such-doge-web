export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}


export interface UserInfoDto {
  username: string,
  email: string,
  publicKey: string,
  enabledAt: string,
  authorities: { authority: string }[]
}

export interface UserInfoPatchResponseDto {
  userInfo: UserInfoDto,
  errMessages: string[]
}

export interface UserInfoUpdateDto {
  email?: string,
  publicKey?: string,
}

export interface UserAchievementsDto {
  username: string,
  memesUploaded: number,
  donationsReceived: number,
  donationsSent: number
}