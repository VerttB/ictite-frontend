import { Button } from "@/components/ui/button";
import { ChevronLeft, UserPlus } from "lucide-react";

export default function Console () {
    return(
        <div className="w-full px-8 py-4">
            {/* |=======| MENU SUPERIOR - CONSOLE |=======| */}
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-2 items-center">
                    <Button variant={"outline"} size={"icon"} className="cursor-pointer"><ChevronLeft /></Button>
                    <h2 className="text-2xl font-semibold">Console</h2>
                </div>
                
                <Button
                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                    className={`
                        flex rounded-md gap-2 items-center px-4 py-2
                        bg-verde text-white
                        hover:cursor-pointer
                    `}
                >
                    <UserPlus size={18} />
                    <span className="text-sm">Adicionar usuário</span>
                </Button>
            </div>
        </div>
    );
}