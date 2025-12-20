import { getSchoolById, getSchoolStatistics } from "@/core/service/SchoolService";
import Image from "next/image";
import { EscolaTabs } from "@/components/escola/EscolaTabs";
import { BookOpen, BrainCircuit, LucideIcon, MapPin, PanelsTopLeft, Printer } from "lucide-react";
import { Downloader } from "@/components/Downloader";
import { SchoolStatistic } from "@/core/interface/SchoolStatistic";
import InfoBar from "@/components/InfoBar";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const school = await getSchoolById(id);

    const schoolStatstics : SchoolStatistic = await getSchoolStatistics(id);

    let stats: { titulo: string; valor: number; Icon: LucideIcon }[] = [];

    stats = [
        {
            titulo: "Pesquisadores",
            valor: schoolStatstics.total_pesquisadores ?? 0,
            Icon: BookOpen,
        },
        {
            titulo: "Projetos",
            valor: schoolStatstics.total_projetos ?? 0,
            Icon: PanelsTopLeft,
        },
        {
            titulo: "Equipamentos",
            valor: schoolStatstics.total_equipamentos ?? 0,
            Icon: Printer,
        },
        {
            titulo: "Clubes de Ciência",
            valor: schoolStatstics.total_clubes ?? 0,
            Icon: BrainCircuit,
        },
    ];



    if (!school) return <div className="px-10 py-6">Escola não encontrada</div>;

    return (
        <div className="flex flex-col gap-8 px-4 sm:px-8">
            <div className="flex flex-col gap-2 sm:flex-row">
                {/* IMAGEM */}
                <div className="relative flex min-h-64 w-full max-w-92 justify-center rounded-lg sm:w-4/5">
                    <Image
                        fill
                        src={
                            school.images?.[0]?.url ||
                            "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt="escola"
                        className="rounded-lg border-3 border-white/60 p-2 shadow-xs"
                    />
                </div>

                <div className="flex flex-col gap-2 text-justify sm:w-2/3 sm:text-left">
                    <div className="mb-2 flex items-start justify-between gap-2 sm:items-center">
                        <p className="text-2xl">{school.name}</p>
                        <Downloader path="schools" id={school.id} />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <MapPin className="text-font-primary/60 text-lg" />
                        <p className="text-font-primary/60 text-lg font-semibold">
                            {school.city}
                        </p>
                    </div>
                    <div className="bg-foreground rounded-md border p-4">
                        <p className="text-font-primary/50 text-lg font-semibold">
                            {school.description}
                        </p>
                    </div>
                </div>
            </div>

            <InfoBar data={stats} /> 

            <EscolaTabs school={school} />
        </div>
    );
}
