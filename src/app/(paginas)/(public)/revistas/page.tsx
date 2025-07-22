import CardRevista from "@/components/card/CardRevista";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Revistas () {
    
    return(
        <div className="w-full  p-8 flex flex-col gap-8">
            {/* |=======| SUPERIOR DE REVISTAS |=======| */}
            <div className="flex flex-row gap-4 items-center">
                <Link href={"/"}>
                    <Button size={"icon"} variant={"outline"}>
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Revistas</h1>
            </div>
            {/* |=======| REVISTAS DA FECIBA |=======| */}
            <div className="relative">
                <div className="absolute inset-x-0 top-0 bg-cover bg-center bg-verde h-[230px] rounded-md"></div>
                <div className="relative">
                    <div className="flex flex-col gap-4 p-4">
                        <h2 className="text-xl font-semibold text-branco">FECIBA</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-center">
                            {Array.from({length: 8}).map((_, i) => (
                                <CardRevista key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* |=======| OUTRAS REVISTAS |=======| */}
            <div className="relative">
                <div className="absolute inset-x-0 top-0 bg-cover bg-center bg-vermelho h-[230px] rounded-md"></div>
                <div className="relative">
                    <div className="flex flex-col gap-4 p-4">
                        <h2 className="text-xl font-semibold text-branco">OUTRAS REVISTAS</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-center">
                            {Array.from({length: 6}).map((_, i) => (
                                <CardRevista key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}