import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../config/firebase";
import { authService } from "./authService";
import { User } from "../../types/user";
import { User as FirebaseUser } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    data: { schoolName: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  auth: typeof auth; // Add auth to the context type
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser?.uid) {
          try {
            const userData = await authService.getUserData(firebaseUser.uid);
            setUser(userData);
          } catch (error) {
            console.error("Error fetching user data:", error);
            await authService.logout(); // Force logout on data fetch error
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login: async (email: string, password: string) => {
      const result = await authService.signInWithEmail(email, password);
      if (!result?.uid) throw new Error("Authentication failed");
      const userData = await authService.getUserData(result.uid);
      setUser(userData);
    },
    signInWithGoogle: async () => {
      const result = await authService.signInWithGoogle();
      if (!result?.uid) throw new Error("Google authentication failed");
      const userData = await authService.getUserData(result.uid);
      setUser(userData);
    },
    signup: async (
      email: string,
      password: string,
      data: { schoolName: string }
    ) => {
      const userData = await authService.signup(email, password, data);
      setUser(userData);
    },
    logout: async () => {
      await authService.logout();
      setUser(null);
    },
    resetPassword: authService.resetPassword,
    auth, // Add auth to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
