import { getAssetPrefix } from "@/core/utils/api";
import Image from "next/image";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
export const Footer = () => {
    return (
        <footer className="bg-foreground relative mt-3 ml-4 flex h-fit min-h-16 xl:h-16 w-full flex-wrap items-center gap-4 rounded-sm p-2 px-4 py-2">
            <Image
                src={`${getAssetPrefix()}/apoios/UnebLogo.svg`}
                alt="Logo"
                width={96}
                height={96}
                className="inline-block object-contain"
            />
            <Image
                src={`${getAssetPrefix()}/apoios/fapesbLogo_semFundo.png`}
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
            <Image
                src={`${getAssetPrefix()}/apoios/governoFederalLogo.png`}
                alt="Logo"
                width={96}
                height={96}
                className="inline-block object-contain"
            />
            <Image
                src={`${getAssetPrefix()}/apoios/fndctLogo.png`}
                alt="Logo"
                width={96}
                height={96}
                className="inline-block object-contain"
            />
            <Image
                src={`${getAssetPrefix()}/apoios/cnpqLogo.png`}
                alt="Logo"
                width={96}
                height={96}
                className="inline-block object-contain"
            />
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Plus size={30} className="font-bold" />
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogTitle>Todos os parceiros do ICTITE</DialogTitle>
                    <div>
                        <Image
                            src={`${getAssetPrefix()}/apoios/ictiteParceiros.jpg`}
                            alt="Logo"
                            width={905}
                            height={1280}
                            className="inline-block object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </footer>
    );
};
