export interface Jwt {
  sub: string;
  authorities: { authority: string }[];
  iat: number;
  exp: number;
}
