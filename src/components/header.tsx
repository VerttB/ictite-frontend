import Image from "next/image"
import {Button} from "../components/ui/button"
import { CircleUserRound, SquareChartGantt } from "lucide-react"
import Link from "next/link"
export const Header = () => {
    return(
        <header className="w-full p-3 bg-cinza-light flex justify-between items-center">
            <div className="flex justify-between gap-4">
                <Image
                src={"/logoImagem.png"}
                alt="Logo"
                width={192}
                height={192}
                className="
                    inline-block 
                "
            />
          

        
            </div>
            <div className="flex flex-row gap-5">
                <Link href={"/console"}>
                    <Button className="text-xl cursor-pointerrounded-xl cursor-pointer py-1 h-fit px-10">
                        <SquareChartGantt />
                        Console
                    </Button>
                </Link>
                <Button  className="text-xl cursor-pointerrounded-xl cursor-pointer py-1 h-fit px-10">
                    <CircleUserRound />
                    Fazer Login
                </Button>
            </div>
        </header>
    )
}