import { getAssetPrefix } from "@/core/utils/api";
import Image from "next/image";
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
   
    return (
        <div className="bg-background flex h-screen">
            <div className="bg-primary flex h-full w-full flex-col justify-between p-24 text-white">
                <Image
                    src={`${getAssetPrefix()}/nova_logo_ictite_04.png`}
                    alt="Logo"
                    width={300}
                    height={100}
                    className="object-contain"
                />
                <p className="font-font-secondary text-2xl">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                    numquam dolorum voluptate quaerat quas sit animi eum
                    delectus necessitatibus earum impedit laudantium facilis
                    possimus, suscipit labore amet quasi libero blanditiis.
                </p>
            </div>
            <div className="h-full w-full">{children}</div>
        </div>
    );
}
