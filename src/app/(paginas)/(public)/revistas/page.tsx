import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Revistas () {
    
    return(
        <div className="w-full p-8">
            <div className="flex flex-row gap-4 items-center">
                <Link href={"/"}>
                    <Button size={"icon"} variant={"outline"}>
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Revistas</h1>
            </div>
        </div>
    );
}