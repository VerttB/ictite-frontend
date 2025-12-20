"use client";

import { FlaskConical, LucideIcon } from "lucide-react";
import ObjetivoClubeExpandido from "./ObjetivoClubeExpandido";
import { useState } from "react";


interface ObjetivoClubeCardProps {
    titulo: string;
    descricao: string;
    Icon: LucideIcon;
}

export default function ObjetivoClubeCard({ titulo, descricao, Icon }: ObjetivoClubeCardProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="bg-foreground hover:shadow-primary hover:border-primary flex w-[300px] flex-col gap-3 rounded-md border p-4 transition-all hover:border-2 hover:shadow-sm cursor-pointer"
            onClick={(e) => {
                setIsOpen(true);
                e.preventDefault();
            }}>
                <div className="text-primary flex items-center gap-2">
                    <Icon className="flex-1/5"/>
                    <h3 className="text-2xl font-semibold">{titulo}</h3>
                </div>
                <div className="line-clamp-4 text-justify">
                    {descricao}
                </div>
            </div>
            <ObjetivoClubeExpandido isOpen={isOpen} onClose={setIsOpen} objetivo={{titulo, descricao, Icon}} />
        </>
    );
}
