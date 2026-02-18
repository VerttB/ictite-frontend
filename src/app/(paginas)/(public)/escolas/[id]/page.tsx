import { getSchoolById, getSchoolStatistics } from "@/core/service/SchoolService";
import { EscolaTabs } from "@/components/escola/EscolaTabs";
import {
    BookOpen,
    BrainCircuit,
    Instagram,
    LucideIcon,
    MapPin,
    PanelsTopLeft,
    Printer,
} from "lucide-react";
import { Downloader } from "@/components/Downloader";
import { SchoolStatistics } from "@/core/domain/School";
import InfoBar from "@/components/InfoBar";
import Link from "next/link";
import { Route } from "next";
import { ImageDisplay } from "@/components/ui/ImageDisplay";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const school = await getSchoolById(id);

    const schoolStatstics: SchoolStatistics = await getSchoolStatistics(id);

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
                <ImageDisplay src={school.images[0]?.url} alt="Imagem da escola" />
                <div className="flex flex-col gap-2 text-justify sm:w-2/3 sm:text-left md:w-full">
                    <div className="mb-2 flex items-start justify-between gap-2 sm:items-center">
                        <p className="text-2xl">{school.name}</p>
                        <Downloader path="schools" id={school.id} />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-row items-center gap-2">
                            <MapPin className="text-font-primary/60 text-lg" />
                            <p className="text-font-primary/60 text-lg font-semibold">
                                {school.city}
                            </p>
                        </div>
                        {school.instagram && (
                            <Link target="_blank" href={school.instagram as Route}>
                                <div className="flex flex-row items-center gap-2 border-l pl-4 hover:underline">
                                    <Instagram className="text-font-primary/60 text-lg" />
                                    <p className="text-font-primary/60 text-lg font-semibold">
                                        {school.instagram}
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>
                    <div className="bg-foreground rounded-md border p-4">
                        <p className="text-font-primary/50 text-lg font-semibold">
                            {school.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[70%_30%] xl:grid-cols-[75%_25%]">
                {/* TABS DA ESCOLA */}
                <div className="order-2 w-full lg:order-1">
                    <EscolaTabs school={school} />
                </div>

                {/* INFOBAR */}
                <div className="order-1 w-full lg:order-2">
                    <InfoBar
                        data={stats}
                        position={
                            typeof window !== "undefined" && window.innerWidth < 768
                                ? "horizontal"
                                : "vertical"
                        }
                    />
                </div>
            </div>
        </div>
    );
}
