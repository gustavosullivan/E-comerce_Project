export interface UserProfile {
  id: number;
  name: string;
  email: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}
