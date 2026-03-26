export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  email: string;
  role: Role;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  role?: Role;
}
