"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Bolt, ChevronRight, CircleUserRound } from "lucide-react";
import Link from "next/link";
import { getAssetPrefix } from "@/core/utils/api";
import { useTheme } from "@/core/providers/ThemeProvider";
import { MoonIcon, SunIcon } from "lucide-react";
import { useViewPort } from "@/hooks/useViewPort";
import { useUserContext } from "@/providers/UserContext";

export const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated } = useUserContext();
    const { isMobile } = useViewPort();
    return (
        <header className="bg-foreground flex w-full items-center justify-between p-3">
            <div className="flex h-full w-full flex-col sm:flex-row sm:gap-2">
                <div className="relative h-16 w-32 sm:w-48">
                    <Image
                        src={`${getAssetPrefix()}/nova_logo_ictite_04.png`}
                        alt="Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <p className="flex items-end text-sm text-gray-500">
                    beta β 1.1
                </p>
            </div>
            <div className="flex flex-row items-center gap-2 sm:gap-4">
                <Link href={"https://simcc.uesc.br/observatorio"}>
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
                    <Link href={"/console"}>
                        <Button
                            variant={"outline"}
                            className="cursor-pointer px-10 py-1 text-xl">
                            <Bolt />
                            {isMobile ? "" : "Console"}
                        </Button>
                    </Link>
                ) : (
                    <Link href={"/login"}>
                        <Button className="px-10 py-1 text-xl">
                            <CircleUserRound />
                            {isMobile ? "" : "Fazer Login"}
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
};
