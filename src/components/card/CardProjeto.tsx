import { Maximize2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import Projeto from "../escola/Projeto";

export default function CardProjeto () {

    const [isProjetoDrawerOpen, setIsProjetoDrawerOpen] = useState(false);

    return(
        <div className=" p-2 flex flex-col gap-4 border shadow justify-center
            border-l-amber-500 border-l-8 w-80 h-full rounded-md bg-slate-50
            ">
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold">Nome do Projeto</h2>
                <Button variant={"outline"} size={"icon"}  className="cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault()
                        setIsProjetoDrawerOpen(true);
                    }}>
                    <Maximize2 />
                </Button>
            </div>
            <p className="text-sm text-gray-500 text-justify max-h-28 overflow-y-auto">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat impedit quos consectetur voluptatem et amet delectus id dolorum optio necessitatibus unde ullam vero, eligendi, quidem velit. Fugit accusamus nulla nobis!</p>
        
            {/* |=======| DRAWER DO PROJETO |=======| */}
            <Projeto isOpen={isProjetoDrawerOpen} onClose={() => setIsProjetoDrawerOpen(false)}/>

        </div>
    );
}