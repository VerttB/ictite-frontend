import { Copy, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "../ui/button";

export default function CardRevista () {
    return(
        <div className="flex flex-col justify-between p-4 border rounded-md w-[300px] h-[200px]">
            <div>
                <h2 className="text-xl font-semibold">Título da Revista</h2>
                <p className="text-slate-500 line-clamp-3">Descrição da revista: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non sint magni quas nesciunt et, dignissimos doloribus repellat blanditiis modi, quae debitis neque nulla fuga optio eligendi ipsam amet numquam quisquam.</p>
            </div>
            <div className="flex flex-row gap-2 justify-end w-full">
                <Button size={"icon"} variant={"ghost"}>
                    <SquareArrowOutUpRight />
                </Button>
                <Button size={"icon"} variant={"ghost"}>
                    <Copy />
                </Button>
            </div>
        </div>
    );
}