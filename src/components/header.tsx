import Image from "next/image"
import {Button} from "../components/ui/button"
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
                <Button className="text-xl cursor-pointerrounded-xl py-1 h-fit px-10">
                    Console
                </Button>
                <Button  className="text-xl cursor-pointerrounded-xl py-1 h-fit px-10">
                    Fazer Login
                </Button>
            </div>
        </header>
    )
}