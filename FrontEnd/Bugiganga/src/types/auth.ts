export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}
