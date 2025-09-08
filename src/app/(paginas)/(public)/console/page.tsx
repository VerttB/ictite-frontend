'use client'

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Upload } from "lucide-react";
import { useState } from "react";

export default function Console () {

    const [entidadeId, setentidadeId] = useState<string | undefined>("");
    const [entidade, setentidade] = useState<string[]>(["escola", "pesquisador", "projeto", "etc..."]);

    return(
        <div className="flex flex-col gap-8 w-full px-8 py-4">
            {/* |=======| MENU SUPERIOR - CONSOLE |=======| */}
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-5 items-center">
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
                    <Upload size={18} />
                    <span className="text-sm">Carregar Arquivo</span>
                </Button>
            </div>

            {/* |=======| FILTRO (SELECT) |=======| */}
            <div className="flex flex-row gap-5">
                <div className="flex flex-row gap-2 items-center">
                    <p className="font-semibold">entidade: </p>
                    <Select
                        onValueChange={(value) => {
                            setentidadeId(value);
                        }}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Selecione a entidade" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>entidade</SelectLabel>
                                {entidade.map(e => (
                                    <SelectItem key={e} value={e}>{e}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}