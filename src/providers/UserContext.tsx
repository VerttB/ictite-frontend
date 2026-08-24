"use client";

import {
    login,
    me,
    logout,
    registerInvited,
} from "@/core/service/AuthService";
import { useRouter } from "next/navigation";
import { createContext, useState, useContext, useEffect } from "react";
import { User, UserLogin } from "@/core/domain/User";
import { RegisterInvitedRequest } from "@/core/domain/Invite";

type UserContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isSchoolAdmin: boolean;
    loginUser: (loginRequest: UserLogin) => Promise<boolean>;
    logoutUser: () => void;
    registerInvitedUser: (payload: RegisterInvitedRequest) => Promise<string | null>;
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
    const isAdmin = user?.role === "ADMIN";
    const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true);
            try {
                const userData = await me();
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

    const loginUser = async (loginRequest: UserLogin): Promise<boolean> => {
        setIsLoading(true);
        try {
            await login(loginRequest);
            const userData = await me();
            setUser(userData);
            if (userData?.role === "SCHOOL_ADMIN") {
                router.push("/school/console");
            } else {
                router.push("/console/v2");
            }
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
        try {
            await logout();
            setUser(null);
            router.push("/");
        } catch (error) {
            console.error("Erro no logout:", error);
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setIsLoading(false);
        }
    };

    const registerInvitedUser = async (
        payload: RegisterInvitedRequest
    ): Promise<string | null> => {
        setIsLoading(true);
        try {
            await registerInvited(payload);
            const userData = await me();
            setUser(userData);
            if (userData?.role === "SCHOOL_ADMIN") {
                router.push("/school/console");
            } else {
                router.push("/console/v2");
            }
            return null;
        } catch (error) {
            console.error("Erro no autocadastro:", error);
            const message = error instanceof Error ? error.message : String(error);
            setError(message);
            setUser(null);
            return message;
        } finally {
            setIsLoading(false);
        }
    };

    const contextValue = {
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isSchoolAdmin,
        loginUser,
        logoutUser,
        registerInvitedUser,
        error,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}
