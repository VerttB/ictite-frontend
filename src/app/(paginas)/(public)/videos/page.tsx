import { Button } from "@/components/ui/button";
import { ChevronLeft, PlaySquare } from "lucide-react";
import Link from "next/link";

export default function Videos () {
    return(
        <div className="w-full p-8 flex flex-col gap-8">
            {/* |=======| SUPERIOR DOS VÍDEOS |=======| */}
            <div className="flex flex-row gap-4 items-center">
                <Link href={"/"}>
                    <Button size={"icon"} variant={"outline"}>
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Vídeos do ICTITE</h1>
            </div>

            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className=" flex flex-col gap-3 bg-verde text-white
                     p-4 mx-4 mt-4 rounded-md shadow-sm border border-blue-100
            ">
                <div className="flex flex-col gap-0">
                    <h2 className="text-xl font-semibold flex gap-1 items-center">
                        <PlaySquare size={18}/>
                        Vídeos Tutorias e Explicativos
                    </h2>
                    <p className="text-xs text-gray-300">Versão pré-beta do site ICTITE</p>
                </div>
                <p>Bem-vindo à nossa aba de vídeos! Nesta seção, você encontrará um acervo dinâmico de conteúdos 
                    audiovisuais produzidos para apoiar sua jornada no mundo da pesquisa e inovação educacional.
                    Aqui você acessa tutoriais, registros de eventos científicos, depoimentos e materiais</p>
            </div>
        </div>
    );
}