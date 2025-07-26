import { Copy, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Revista } from "@/core/interface/Revista";

interface CardRevistaProps {
    revista: Revista;
}

export default function CardRevista ({ revista }: CardRevistaProps) {
    return(
        <div className="flex flex-col justify-between p-4 border rounded-md w-[250px] h-[200px] bg-gray-50">
            <div>
                <h2 className="text-xl font-semibold">{revista.title}</h2>
                <p className="text-gray-500 line-clamp-3">{revista.description}</p>
            </div>
            <div className="flex flex-row gap-2 justify-end w-full">
                <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
                    <SquareArrowOutUpRight />
                </Button>
                <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
                    <Copy />
                </Button>
            </div>
        </div>
    );
}