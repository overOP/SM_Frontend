export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  email: string;
  role: Role;
  /** Optional display name for the UI (demo accounts populate this on login). */
  name?: string;
  /** Stable id for RBAC / mock data (set on login in demo). */
  id?: string;
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
export * from "./schema";
export * from "./results";