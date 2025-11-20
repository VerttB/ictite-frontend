"use client";

import { Copy, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Revista } from "@/core/interface/Revista";
import Link from "next/link";
import { toast } from "sonner";

interface CardRevistaProps {
    revista: Revista;
}

export default function CardRevista({ revista }: CardRevistaProps) {
    const handleCopiarLink = async () => {
        try {
            await navigator.clipboard.writeText(revista.link);
            toast.success("Link copiado para a área de transferência!");
        } catch (error) {
            console.error("Falha ao copiar o link: ", error);
            toast.error("Falha ao copiar o link");
        }
    };

    return (
        <div className="bg-foreground flex h-[200px] w-[250px] flex-col justify-between rounded-md border p-4">
            <div>
                <h2 className="text-xl font-semibold">{revista.title}</h2>
                <p className="line-clamp-3 text-gray-500">
                    {revista.description}
                </p>
            </div>
            <div className="flex w-full flex-row justify-end gap-2">
                <Link href={revista.link} target="_blank">
                    <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="cursor-pointer">
                        <SquareArrowOutUpRight />
                    </Button>
                </Link>
                <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="cursor-pointer"
                    onClick={handleCopiarLink}>
                    <Copy />
                </Button>
            </div>
        </div>
    );
}
