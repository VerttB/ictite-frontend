import { Maximize2 } from "lucide-react";
import { Button } from "../ui/button";

export default function CardProjeto () {
    return(
        <div className=" p-2 flex flex-col gap-4 border shadow justify-center
            border-l-amber-500 border-l-8 w-1/4 h-full rounded-md bg-slate-50
            ">
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-semibold">Nome do Projeto</h2>
                <Button variant={"outline"} size={"icon"}>
                    <Maximize2 />
                </Button>
            </div>
            <p className="text-sm text-gray-500 text-center">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat impedit quos consectetur voluptatem et amet delectus id dolorum optio necessitatibus unde ullam vero, eligendi, quidem velit. Fugit accusamus nulla nobis!</p>
        </div>
    );
}