import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Materiais () {
    return(
        <div className="w-full px-8 py-4">
            <div className="flex flex-row gap-5 items-center">
                <Button size={"icon"} variant={"outline"} className="cursor-pointer"><ChevronLeft /></Button>
                <p className="text-2xl font-semibold">Materiais Didáticos</p>
            </div>
        </div>
    );
}