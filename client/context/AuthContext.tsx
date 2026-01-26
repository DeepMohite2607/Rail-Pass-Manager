import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { AuthStorage } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  setUserRole: (role: UserRole) => void;
  pendingRole: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRole, setPendingRole] = useState<UserRole>("student");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AuthStorage.getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (phone: string, otp: string): Promise<boolean> => {
    try {
      if (otp !== "123456") {
        return false;
      }

      const existingUser = await AuthStorage.getUser();
      if (existingUser && existingUser.phone === phone) {
        setUser(existingUser);
        return true;
      }

      const newUser: User = {
        id: uuidv4(),
        phone,
        role: pendingRole,
        fullName: "",
        profileComplete: false,
        createdAt: new Date().toISOString(),
      };

      await AuthStorage.saveUser(newUser);
      await AuthStorage.saveToken(uuidv4());
      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, [pendingRole]);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      if (password.length < 4) {
        return false;
      }

      const existingUser = await AuthStorage.getUser();
      if (existingUser && existingUser.email === email) {
        setUser(existingUser);
        return true;
      }

      const newUser: User = {
        id: uuidv4(),
        phone: "",
        email,
        role: pendingRole,
        fullName: "",
        profileComplete: false,
        createdAt: new Date().toISOString(),
      };

      await AuthStorage.saveUser(newUser);
      await AuthStorage.saveToken(uuidv4());
      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Email login failed:", error);
      return false;
    }
  }, [pendingRole]);

  const logout = useCallback(async () => {
    try {
      await AuthStorage.clearAll();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      ...updates,
      profileComplete: Boolean(
        updates.fullName || user.fullName
      ),
    };

    await AuthStorage.saveUser(updatedUser);
    setUser(updatedUser);
  }, [user]);

  const setUserRole = useCallback((role: UserRole) => {
    setPendingRole(role);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithEmail,
        logout,
        updateProfile,
        setUserRole,
        pendingRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
