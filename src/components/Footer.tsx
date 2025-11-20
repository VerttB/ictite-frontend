import { getAssetPrefix } from "@/core/utils/api";
import Image from "next/image";
export const Footer = () => {
    return (
        <footer className="bg-foreground relative mt-3 ml-4 flex h-16 w-full flex-wrap items-center gap-4 rounded-sm p-2 px-4 py-2">
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
        </footer>
    );
};
