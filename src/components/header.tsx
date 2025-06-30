import Image from "next/image"
import {Button} from "../components/ui/button"
export const Header = () => {
    return(
        <div className="w-full p-3 bg-cinza-light flex justify-between items-center">
            <div>
                <Image
                src={"/logo_ia_editais.png"}
                alt="Logo"
                width={200}
                height={150}
                className="
                    inline-block 
                "
            />

            <Image 
                src={"/logo_fiocruz.png"}
                alt="Logo"
                width={150}
                height={150}
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