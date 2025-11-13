"use client";

import { login, me, logout } from "@/core/service/AuthService";
import { useRouter } from "next/navigation";
import { createContext , useState, useContext, useEffect } from "react";
import { User } from "@/core/interface/User";

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginUser: (user: Pick<User, "username" | "password">) => Promise<boolean>;
  logoutUser: () => void;
  error: string | null;

};

export const UserContext = createContext<UserContextType | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const userData = await me();
        console.log("User data:", userData);
        setUser(userData);
      } catch (e) {
        console.warn("Nenhum perfil ativo", e);
        setError(e instanceof Error ? e.message : String(e));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const loginUser = async (user: Pick<User, "username" | "password">): Promise<boolean> => {
    setIsLoading(true);
    try {
      await login(user);
      const userData = await me();
      setUser(userData);
      router.push("/");
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      setError(error instanceof Error ? error.message : String(error));
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    try{
      await logout();
      setUser(null);
      router.push("/");
    }
    catch(error){
      console.error("Erro no logout:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    isLoading,
    isAuthenticated,
    loginUser,
    logoutUser,
    error,
  };


  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
