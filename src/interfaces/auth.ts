export interface CreateSessionDto {
  lat: number;
  long: number;
  ip_address: string;
  device: string;
}

export interface GoogleAuthDto extends CreateSessionDto {
  code: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto extends LoginDto {
  name: string;
}

export interface AuthForm extends LoginDto {
  name?: string;
}
