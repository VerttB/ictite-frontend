import Image from "next/image"
import {Button} from "../components/ui/button"
import { Bolt, CircleUserRound } from "lucide-react"
import Link from "next/link"
import { getAssetPrefix } from "@/core/utils/api";
const isProd = process.env.NODE_ENV === "production";

export const Header = () => {
    return(
        <header className="w-full p-3 bg-foreground flex justify-between items-center">
            <div className="flex justify-between gap-4">
                <Image
                src={`${getAssetPrefix()}/logoImagem.png`}
                alt="Logo"
                width={192}
                height={192}
                className="
                    inline-block 
                "
            />
                <p className="text-sm text-gray-500 flex items-end">beta β 1.1</p>

        
            </div>
            <div className="flex flex-row gap-5">
                <Link href={"/console"}>
                    <Button variant={"outline"}  className="text-xl  cursor-pointerrounded-xl cursor-pointer py-1 px-10">
                        <Bolt />
                        Console
                    </Button>
                </Link>
                <Button  className="text-xl cursor-pointerrounded-xl cursor-pointer py-1  px-10">
                    <CircleUserRound />
                    Fazer Login
                </Button>
            </div>
        </header>
    )
}