import Image from "next/image"
export const Footer = () => {
    return(
    <footer className="w-full px-4 py-2 h-16 gap-4 bg-cinza-light flex items-center relative ">

            <Image
            src={"/apoios/UnebLogo.svg"}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
                    />
            <Image
            src={"/apoios/fapesbLogo.jpg"}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
            />           
            <Image
            src={"/apoios/governoDoEstadoLogo.png"}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
            />   
             <Image
            src={"/apoios/fiocruzLogo.png"}
            alt="Logo"
            width={96}
            height={96}
            className="inline-block object-contain"
            /> 

    </footer>)
}