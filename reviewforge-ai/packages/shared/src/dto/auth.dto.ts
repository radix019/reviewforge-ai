export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
}
