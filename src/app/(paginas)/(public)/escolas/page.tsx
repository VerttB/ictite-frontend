import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Escolas () {
    return(
        <div className="flex w-full flex-col gap-8 py-4 sm:px-8"> 
            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <div className="flex flex-row items-center gap-5">
                <Button size={"icon"} variant={"outline"} className="cursor-pointer">
                    <ChevronLeft />
                </Button>
                <p className="text-2xl font-semibold">Escolas</p>
            </div>
        </div>
    )
}