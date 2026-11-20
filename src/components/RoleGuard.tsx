"use client";

import { useUserContext } from "@/providers/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { getConsolePath } from "@/core/utils/authNavigation";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, isLoading } = useUserContext();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        if (user && !allowedRoles.includes(user.role)) {
            router.replace(getConsolePath(user.role));
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, pathname, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <LoaderCircle className="text-primary animate-spin" size={32} />
            </div>
        );
    }

    if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
