'use client'

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Upload } from "lucide-react";
import { useState } from "react";

type Entidade = "escola" | "revista" | "material" | "pesquisador" | "projeto" | "equipamento";

export default function Console () {

    const [entidadeId, setEntidadeId] = useState<string | undefined>("");
    const [entidadeSelecionada, setEntidadeSelecionada] = useState<Entidade | null>(null);
    const [escolaSelecionada, setEscolaSelecionada] = useState<string | null>(null);

    const escolas = [
        { id: "1", nome: "Escola Municipal A" },
        { id: "2", nome: "Colégio Estadual B" },
        { id: "3", nome: "Instituto Federal C" },
    ];

    const entidades: Entidade[] = ["escola", "revista", "material", "pesquisador", "projeto", "equipamento"];

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-cinza-light rounded-sm p-4 border-2">
                <div className="flex flex-row gap-2 items-center">
                    <p className="font-semibold">Entidade: </p>
                    <Select
                        onValueChange={(value) => {
                            setEntidadeSelecionada(value as Entidade);
                        }}
                    >
                        <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Selecione a entidade" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Entidade</SelectLabel>
                                {entidades.map(entidade => (
                                    <SelectItem key={entidade} value={entidade}>{entidade}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {(entidadeSelecionada === "pesquisador" || entidadeSelecionada === "projeto" || entidadeSelecionada === "equipamento") && (
                    <div className="flex flex-row gap-2 items-center">
                        <p className="font-semibold w-24">Escola:</p>
                        <Select
                            onValueChange={(value) => setEscolaSelecionada(value)}
                            value={escolaSelecionada || undefined}
                        >
                            <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Selecione a escola" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Escolas</SelectLabel>
                                {escolas.map((escola) => (
                                <SelectItem key={escola.id} value={escola.id}>
                                    {escola.nome}
                                </SelectItem>
                                ))}
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <div>

            </div>
        </div>
    );
}