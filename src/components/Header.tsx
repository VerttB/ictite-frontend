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
    const isInConsole = pathname.startsWith("/console") || pathname.startsWith("/school/console");
    const consolePath = user?.role === "SCHOOL_ADMIN" ? "/school/console" : "/console/v2";

    const logoSrc =
        theme === "dark"
            ? `${getAssetPrefix()}/nova_logo_ictite_branca.png`
            : `${getAssetPrefix()}/nova_logo_ictite.png`;

    return (
        <header className="bg-foreground flex w-full items-center justify-between p-3">
            <div className="flex h-full w-full flex-col sm:flex-row sm:gap-2">
                <div className="relative h-16 w-32 sm:w-48">
                    <Image src={logoSrc} alt="Logo" fill className="object-contain" priority />
                </div>
                <p className="flex items-end text-sm text-gray-500">Versão 2.3.1</p>
            </div>
            <div className="flex flex-row items-center gap-2 sm:gap-4">
                <Link target="_blank" href={"https://simcc.uesc.br/observatorio"}>
                    <Button
                        size={isMobile ? "icon" : "default"}
                        className="cursor-pointer text-xl">
                        {isMobile ? <ChevronRight /> : "Observatório"}
                    </Button>
                </Link>
                <Button
                    size={"icon"}
                    variant="outline"
                    onClick={toggleTheme}
                    className="cursor-pointer text-xl"
                    title={
                        theme === "light"
                            ? "Mudar para tema escuro"
                            : "Mudar para tema claro"
                    }>
                    {theme === "light" ? <MoonIcon /> : <SunIcon />}
                </Button>
                {isAuthenticated ? (
                    <Button
                        asChild
                        variant={ isInConsole ? "default" : "outline"}
                        className="cursor-pointer px-10 py-1 text-xl">
                        <Link href={consolePath}>
                            <Bolt />
                            {isMobile ? "" : "Console"}
                        </Link>
                    </Button>
                ) : (
                    <Button asChild className="px-10 py-1 text-xl">
                        <Link href={"/login"}>
                            <CircleUserRound />
                            {isMobile ? "" : "Fazer Login"}
                        </Link>
                    </Button>
                )}
            </div>
        </header>
    );
};
