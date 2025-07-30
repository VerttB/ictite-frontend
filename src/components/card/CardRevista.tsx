'use client'

import { Copy, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Revista } from "@/core/interface/Revista";
import Link from "next/link";
import { toast } from "sonner";

interface CardRevistaProps {
    revista: Revista;
}

export default function CardRevista ({ revista }: CardRevistaProps) {

    const handleCopiarLink = async () => {
        try {
            await navigator.clipboard.writeText(revista.link)
            console.log("Link copiado para a área de transferência!")
            toast.success("Link copiado para a área de transferência!")
        } catch (error) {
            console.error("Falha ao copiar o link: ", error);
            toast.error("Falha ao copiar o link");
        }
    }

    return(
        <div className="flex flex-col justify-between p-4 border rounded-md w-[250px] h-[200px] bg-gray-50">
            <div>
                <h2 className="text-xl font-semibold">{revista.title}</h2>
                <p className="text-gray-500 line-clamp-3">{revista.description}</p>
            </div>
            <div className="flex flex-row gap-2 justify-end w-full">
                <Link href={revista.link} target="_blank">
                    <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
                        <SquareArrowOutUpRight />
                    </Button>
                </Link>
                <Button size={"icon"} variant={"ghost"} className="cursor-pointer" onClick={handleCopiarLink}>
                    <Copy />
                </Button>
            </div>
        </div>
    );
}