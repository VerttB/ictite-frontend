import { getAssetPrefix } from "@/core/utils/api"
import Image from "next/image"
export const Footer = () => {
    return(
    <footer 
        className="
                w-full px-4 py-2 h-16 gap-4 mt-3 p-2 rounded-sm
                bg-foreground flex flex-wrap items-center ml-4  relative
        "
>

            <Image
            src={`${getAssetPrefix()}/apoios/UnebLogo.svg`}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
                    />
            <Image
            src={`${getAssetPrefix()}/apoios/fapesbLogo.jpg`}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
            />           
            <Image
            src={`${getAssetPrefix()}/apoios/governoDoEstadoLogo.png`}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
            />   
             <Image
            src={`${getAssetPrefix()}/apoios/fiocruzLogo.png`}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
            /> 

    </footer>)
}