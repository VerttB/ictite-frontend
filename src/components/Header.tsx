"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Bolt, ChevronRight, CircleUserRound, MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { getAssetPrefix } from "@/core/utils/api";
import { useTheme } from "@/core/providers/ThemeProvider";
import { useViewPort } from "@/hooks/useViewPort";
import { useUserContext } from "@/providers/UserContext";
import { usePathname } from "next/navigation";

export const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, user } = useUserContext();
    const { isMobile } = useViewPort();

    const pathname = usePathname();
    const isSchoolConsole = pathname.startsWith("/school/console");
    const isInConsole = pathname.startsWith("/console") || isSchoolConsole;
    const consolePath =
        user?.role === "SCHOOL_ADMIN"
            ? "/school/console"
            : user?.role === "ADMIN"
              ? "/console/v2"
              : null;

    const logoSrc =
        theme === "dark"
            ? `${getAssetPrefix()}/nova_logo_ictite_branca.png`
            : `${getAssetPrefix()}/nova_logo_ictite.png`;

    return (
        <header className="bg-foreground text-font-primary flex w-full min-w-0 flex-wrap items-center justify-between gap-2 p-3">
            <div className="flex min-w-0 flex-col sm:flex-row sm:gap-2">
                <div className="relative h-16 w-32 sm:w-48">
                    <Image
                        src={logoSrc}
                        alt="Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <p className="text-font-secondary flex items-end text-sm">Versão 2.3.1</p>
            </div>
            <div className="flex flex-row items-center gap-2 sm:gap-4">
                {!isSchoolConsole && (
                    <Button
                        asChild
                        size={isMobile ? "icon" : "default"}
                        className="cursor-pointer text-xl">
                        <Link
                            target="_blank"
                            aria-label="Observatório"
                            href={"https://observatoriocti.secti.ba.gov.br"}>
                            {isMobile ? <ChevronRight /> : "Observatório"}
                        </Link>
                    </Button>
                )}
                <Button
                    size={"icon"}
                    variant="outline"
                    onClick={toggleTheme}
                    aria-label={
                        theme === "light"
                            ? "Mudar para tema escuro"
                            : "Mudar para tema claro"
                    }
                    className="cursor-pointer text-xl"
                    title={
                        theme === "light"
                            ? "Mudar para tema escuro"
                            : "Mudar para tema claro"
                    }>
                    {theme === "light" ? <MoonIcon /> : <SunIcon />}
                </Button>
                {isAuthenticated && consolePath ? (
                    <Button
                        asChild
                        variant={isInConsole ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1 text-xl sm:px-6">
                        <Link href={consolePath} aria-label="Console">
                            <Bolt />
                            {isMobile ? "" : "Console"}
                        </Link>
                    </Button>
                ) : !isAuthenticated ? (
                    <Button asChild className="px-3 py-1 text-xl sm:px-6">
                        <Link href={"/login"} aria-label="Fazer Login">
                            <CircleUserRound />
                            {isMobile ? "" : "Fazer Login"}
                        </Link>
                    </Button>
                ) : null}
            </div>
        </header>
    );
};
