import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { AuthContextType, User, Role, LoginResult } from "../types";

export const AuthContext = createContext<AuthContextType | null>(null);

interface Credentials {
  password: string;
  role: Role;
}

const USERS: Record<string, Credentials> = {
  "admin@edumanage.com": { password: "admin123", role: "admin" },
  "teacher@edumanage.com": { password: "teacher123", role: "teacher" },
  "student@edumanage.com": { password: "student123", role: "student" },
  "parent@edumanage.com": { password: "parent123", role: "parent" },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const parsed = JSON.parse(stored) as User;
    const validRoles: Role[] = ['admin', 'teacher', 'student', 'parent'];
    if (!validRoles.includes(parsed.role)) {
      localStorage.removeItem("user"); // wipe stale/invalid data
      return null;
    }
    return parsed;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // ✅ FIX 1: Memoized login
  const login = useCallback(
    (email: string, password: string): LoginResult => {
      const found = USERS[email.toLowerCase()];

      if (!found || found.password !== password) {
        return { success: false, message: "Invalid email or password" };
      }

      const userData: User = { email, role: found.role };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, role: found.role };
    },
    []
  );

  // ✅ FIX 2: Memoized logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  // ✅ FIX 3: Memoized context value
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-blue-600 font-medium">
          Loading session...
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};