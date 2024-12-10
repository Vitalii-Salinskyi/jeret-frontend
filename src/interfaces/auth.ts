export interface GoogleAuthDto {
  code: string;
  lat: number;
  long: number;
  ip: string;
  device: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
