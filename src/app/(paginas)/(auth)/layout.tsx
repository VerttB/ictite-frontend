import { getAssetPrefix } from "@/core/utils/api";
import Image from "next/image";
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
   
    return (
        <div className="bg-background flex h-screen">
            <div className="hidden bg-primary lg:flex h-full w-full flex-col justify-between p-24 text-white">
                
                <div className="flex flex-col gap-2">
                    <div>
                        <Image
                            src={`${getAssetPrefix()}/nova_logo_ictite_04.png`}
                            alt="Logo"
                            width={300}
                            height={100}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col text-4xl font-semibold leading-tight tracking-tight">
                        <p>Impulsionando a</p>
                        <p className="text-blue-300 font-black">Ciência nas Escolas</p>
                        <p>da Bahia</p>
                    </div>
                    <div className="bg-secondary h-2 w-24 rounded-md"></div>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="font-medium italic text-2xl">
                        A inovação e a educação científica são os motores fundamentais para o desenvolvimento regional sustentável e a transformação social.
                    </p>
                    <div className="flex gap-2 items-center">
                        <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center">
                            BA
                        </div>
                        <span className="font-medium text-xl">REDE ICTITE</span>
                    </div>
                </div>
            </div>
            <div className="h-full w-full">{children}</div>
        </div>
    );
}
