import Image from "next/image"
export const Footer = () => {
    return(
    <footer 
        className="
                w-[600px] px-4 py-2 h-16 gap-4 mt-3 p-2 rounded-sm
                bg-white flex items-center ml-4 justify-between relative
        "
>

            <Image
            src={"/ictite/v1/web/apoios/UnebLogo.svg"}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
                    />
            <Image
            src={"/ictite/v1/web/apoios/fapesbLogo.jpg"}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
            />           
            <Image
            src={"/ictite/v1/web/apoios/governoDoEstadoLogo.png"}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
            />   
             <Image
            src={"/ictite/v1/web/apoios/fiocruzLogo.png"}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
            /> 

    </footer>)
}