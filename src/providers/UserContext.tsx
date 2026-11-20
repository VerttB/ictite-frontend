"use client";

import { login, me, logout, registerInvited } from "@/core/service/AuthService";
import { useRouter } from "next/navigation";
import { createContext, useState, useContext, useEffect, useRef } from "react";
import { User, UserLogin } from "@/core/domain/User";
import { RegisterInvitedRequest } from "@/core/domain/Invite";
import { getLoginReturnPath } from "@/core/utils/authNavigation";
import { getAssetPrefix } from "@/core/utils/api";

type UserContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isSchoolAdmin: boolean;
    loginUser: (loginRequest: UserLogin) => Promise<boolean>;
    logoutUser: () => Promise<void>;
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

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const isAuthenticated = !!user;
    const isAdmin = user?.role === "ADMIN";
    const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
    const router = useRouter();
    const sessionVersion = useRef(0);

    useEffect(() => {
        let active = true;
        const version = sessionVersion.current;
        const loadUser = async () => {
            setIsLoading(true);
            try {
                const userData = await me();
                if (active && version === sessionVersion.current) setUser(userData);
            } catch (e) {
                if (active && version === sessionVersion.current) {
                    setError(e instanceof Error ? e.message : String(e));
                    setUser(null);
                }
            } finally {
                if (active && version === sessionVersion.current) setIsLoading(false);
            }
        };
        loadUser();
        const expireSession = () => {
            sessionVersion.current++;
            setUser(null);
            setIsLoading(false);
            setError("Sua sessão expirou. Faça login novamente.");
        };
        window.addEventListener("ictite:session-expired", expireSession);
        return () => {
            active = false;
            window.removeEventListener("ictite:session-expired", expireSession);
        };
    }, []);

    const loginUser = async (loginRequest: UserLogin): Promise<boolean> => {
        sessionVersion.current++;
        setError(null);
        setIsLoading(true);
        try {
            await login(loginRequest);
            const userData = await me();
            setUser(userData);
            const redirect = new URLSearchParams(window.location.search).get("redirect");
            router.replace(getLoginReturnPath(redirect, userData.role, getAssetPrefix()));
            router.refresh();
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
        sessionVersion.current++;
        setError(null);
        setIsLoading(true);
        try {
            await logout();
            setUser(null);
            router.replace("/login");
            router.refresh();
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
        sessionVersion.current++;
        setError(null);
        setIsLoading(true);
        try {
            await registerInvited(payload);
            const userData = await me();
            setUser(userData);
            router.replace(getLoginReturnPath(null, userData.role));
            router.refresh();
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

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}
