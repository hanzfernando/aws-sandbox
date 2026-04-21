export interface User {
  id: number;
  name: string;
  email: string;
  profile_pic_url?: string | null;
}

export interface SignupRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponseDto {
  user: AuthUserDto;
  token: string;
}

export interface LoginRequestDto {
	email: string;
	password: string;
}

export interface AuthUserDto {
	id: number;
	name: string;
	email: string;
  profile_pic_url?: string | null;
}

export interface LoginResponseDto {
	user: AuthUserDto;
	token: string;
}

export interface LogoutResponseDto {
	success: boolean;
}
