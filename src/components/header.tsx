'use client'
import Image from "next/image"
import {Button} from "../components/ui/button"
import { Bolt, CircleUserRound } from "lucide-react"
import Link from "next/link"
import { getAssetPrefix } from "@/core/utils/api";
import { useTheme } from "@/core/providers/ThemeProvider";
import { MoonIcon, SunIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
const isProd = process.env.NODE_ENV === "production";

export const Header = () => {
    const { theme, toggleTheme } = useTheme()
    const isMobile = useIsMobile();
    return(
        <header className="w-full p-3 bg-foreground flex justify-between items-center">
            <div className="flex flex-col sm:flex-row   w-full h-full sm:gap-2">
            <div className="relative w-32  sm:w-48 h-16">
                <Image
                src={`${getAssetPrefix()}/logoImagem.png`}
                alt="Logo"
                fill
                className="
                    object-contain"/>
            </div>
                <p className="text-sm text-gray-500 flex items-end">beta β 1.1</p>

        
            </div>
            <div className="flex flex-row items-center gap-2 sm:gap-4">
                <Button 
                    size={"icon"}
                    variant="outline"
                    onClick={toggleTheme}
                    className="text-xl cursor-pointer "
                    title={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}>
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </Button>
                <Link href={"/console"}>
                    <Button variant={"outline"}  className="text-xl cursor-pointer py-1 px-10">
                        <Bolt />
                        {isMobile ? "" : "Console"}
                    </Button>
                </Link>
                <Button  className="text-xl  py-1  px-10">
                    <CircleUserRound />
                    {isMobile ? "Login" : "Fazer Login"}
                </Button>
            </div>
        </header>
    )
}