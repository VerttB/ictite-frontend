import ClubeCienciaCard from "@/components/clubeCiencia/ClubeCienciaCard";
import ObjetivoClubeCard from "@/components/clubeCiencia/ObjetivoClubeCard";
import InfoBar from "@/components/InfoBar";
import { Button } from "@/components/ui/button";
import { BookA, BookOpenText, BrainCircuit, ChartBar, ChartSpline, ChevronLeft, Goal, HeartHandshake, LucideIcon } from "lucide-react";

export default function Clubes() {

    let stats: { titulo: string; valor: number; Icon: LucideIcon }[] = [];

    stats = [
        {
            titulo: "Clubes de Ciência",
            valor: 34,
            Icon: BrainCircuit,
        },
        {
            titulo: "Alunos",
            valor: 100,
            Icon: BookA,
        },
        {
            titulo: "Professores",
            valor: 41,
            Icon: BookOpenText,
        },
        {
            titulo: "Facilitadores",
            valor: 28,
            Icon: HeartHandshake,
        },
        {
            titulo: "Média de alunos por clube",
            valor: 4.1,
            Icon: ChartBar,
        },
        {
            titulo: "Média de projetos por clube",
            valor: 1.2,
            Icon: ChartSpline,
        },
    ];

    return (
        <div className="flex flex-col gap-8 w-full  sm:px-8 py-4">

            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <div className="flex flex-row gap-5 items-center">
                <Button size={"icon"} variant={"outline"} className="cursor-pointer"><ChevronLeft /></Button>
                <p className="text-2xl font-semibold">Clubes de Ciência</p>
            </div>

            {/* |=======| OBJETIVOS DOS CLUBES DE CIÊNCIA |=======| */}
            <div className="flex flex-col gap-5">
                <div className="flex gap-2 items-center">
                    <Goal />
                    <h2 className="text-2xl font-semibold">Objetivos dos Clubes de Ciência</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
                    <ObjetivoClubeCard />
                    <ObjetivoClubeCard />
                    <ObjetivoClubeCard />
                </div>
            </div>

            {/* |=======| ESTATÍSTICAS DOS CLUBES DE CIÊNCIA |=======| */}
            <div className="w-full">
                <InfoBar data={stats} />
            </div>

            {/* |=======| LISTAGEM DOS CLUBES DE CIÊNCIA |=======| */}
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">Clubes de Ciência:</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-center">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <ClubeCienciaCard key={i} />
                    ))}
                </div>
            </div>
            
        </div>
    )
}