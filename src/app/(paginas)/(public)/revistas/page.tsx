import CardRevista from "@/components/card/CardRevista";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Revistas () {
    
    return(
        <div className="w-full p-8 flex flex-col gap-8">
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
            <div>
                <h2 className="text-xl font-semibold">FECIBA</h2>
                <div>
                    <CardRevista />
                </div>
            </div>
        </div>
    );
}