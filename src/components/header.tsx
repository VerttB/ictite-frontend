import Image from "next/image"
import {Button} from "../components/ui/button"
export const Header = () => {
    return(
        <div className="w-full p-3 bg-cinza-light flex justify-between items-center">
            <div>
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
            <Button  className="text-xl cursor-pointerrounded-xl py-1 h-fit px-10">
                Fazer Login
            </Button>
        </div>
    )
}