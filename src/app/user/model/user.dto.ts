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

export interface ChangeEmailDto {
  email: string,
}

export interface UserAchievementsDto {
  username: string,
  achievements: AchievementDto[]
}

export interface AchievementDto {
  name: string,
  value: string
}
