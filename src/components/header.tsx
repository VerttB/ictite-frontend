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
            <Image
                        src={"/apoios/UnebLogo.jpg"}
                        alt="Logo"
                        width={128}
                        height={64}
                        className="inline-block object-contain h-16"
                                />
                        <Image
                        src={"/apoios/fapesbLogo.jpg"}
                        alt="Logo"
                        width={128}
                        height={64}
                        className="inline-block object-contain  h-16"
                        />           
                        <Image
                        src={"/apoios/governoDoEstadologo.png"}
                        alt="Logo"
                        width={128}
                        height={64}
                        className="inline-block object-contain  h-16"
                        />   
                         <Image
                        src={"/apoios/fiocruzLogo.png"}
                        alt="Logo"
                        width={128}
                        height={64}
                        className="inline-block object-contain  h-16"
                        /> 

        
            </div>
            <Button  className="text-xl cursor-pointerrounded-xl py-1 h-fit px-10">
                Fazer Login
            </Button>
        </header>
    )
}