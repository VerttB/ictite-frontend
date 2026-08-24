"use client";

import {
    ArrowLeft,
    BookOpen,
    Eye,
    FlaskConical,
    Instagram,
    PanelsTopLeft,
    Printer,
    School,
    Users,
} from "lucide-react";

import { SchoolFormDataInput } from "@/schemas/schoolSubmissionSchema";

interface ClubSitePreviewProps {
    data: SchoolFormDataInput;
    onBack: () => void;
}

export function ClubSitePreview({ data, onBack }: ClubSitePreviewProps) {
    const clubs = data.clubs || [];
    const projects = data.projects || [];
    const researchers = data.researchers || [];
    const equipments = data.equipments || [];

    return (
        <div className="animate-fade-in flex w-full flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-md p-3">
                        <Eye size={26} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">
                            Ver como ficará no &quot;site&quot;
                        </h2>
                        <p className="text-font-primary/60 text-sm">
                            Demonstração com as informações atuais do rascunho.
                        </p>
                    </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                    <Eye size={15} /> Modo de pré-visualização — esta página ainda não
                    está publicada.
                </span>
            </div>

            {clubs.length === 0 ? (
                <section className="bg-foreground flex flex-col gap-4 rounded-md border p-6">
                    <div className="flex items-center gap-3">
                        <FlaskConical className="text-primary" size={32} />
                        <div>
                            <h1 className="text-2xl font-semibold">Clube de Ciência</h1>
                            <p className="text-font-primary/60 flex items-center gap-2 text-sm">
                                <School size={16} />
                                {data.school?.name || "Escola ainda não informada"}
                            </p>
                        </div>
                    </div>
                    <p className="text-font-primary/60 border-t pt-4 text-sm">
                        Nenhum Clube de Ciência foi informado neste rascunho.
                    </p>
                </section>
            ) : (
                clubs.map((club, clubIndex) => {
                    const clubProjects = projects.filter(
                        (project) => project.clube_ciencia_id === club.id
                    );
                    const projectIds = new Set(clubProjects.map((project) => project.id));
                    const clubResearchers = researchers.filter((researcher) =>
                        (researcher.project_ids || []).some((projectId) =>
                            projectIds.has(projectId)
                        )
                    );

                    return (
                        <section
                            key={club.id || clubIndex}
                            className="bg-foreground flex flex-col gap-8 rounded-md border p-5 sm:p-8">
                            <div className="flex flex-col gap-4 border-b pb-5">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 text-primary flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-md">
                                        <FlaskConical size={36} />
                                    </div>
                                    <div className="flex min-w-0 flex-col gap-2">
                                        <p className="text-font-primary/50 text-xs font-semibold uppercase">
                                            Clube de Ciência{" "}
                                            {clubs.length > 1 ? clubIndex + 1 : ""}
                                        </p>
                                        <h1 className="text-3xl font-semibold">
                                            {club.name ||
                                                "Nome do clube ainda não informado"}
                                        </h1>
                                        <div className="text-primary flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                                            <span className="flex items-center gap-2">
                                                <School size={18} />
                                                {data.school?.name ||
                                                    "Escola ainda não informada"}
                                            </span>
                                            {club.instagram_url && (
                                                <span className="flex items-center gap-2">
                                                    <Instagram size={18} />
                                                    {club.instagram_url}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {data.school?.description && (
                                    <div className="rounded-md border p-4">
                                        <p className="text-sm font-semibold">
                                            Sobre a escola
                                        </p>
                                        <p className="text-font-primary/60 mt-1 text-sm">
                                            {data.school.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <PanelsTopLeft size={22} />
                                    <h2 className="text-2xl font-semibold">Projetos</h2>
                                </div>
                                {clubProjects.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {clubProjects.map((project, projectIndex) => (
                                            <article
                                                key={project.id || projectIndex}
                                                className="rounded-md border bg-white p-4 shadow-xs">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="font-semibold">
                                                        {project.name ||
                                                            "Projeto ainda sem nome"}
                                                    </h3>
                                                    {project.year && (
                                                        <span className="bg-secondary/10 text-secondary rounded-sm px-2 py-1 text-xs font-semibold">
                                                            {project.year}
                                                        </span>
                                                    )}
                                                </div>
                                                {project.description && (
                                                    <p className="text-font-primary/60 mt-3 text-sm">
                                                        {project.description}
                                                    </p>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-font-primary/60 rounded-md border border-dashed p-4 text-sm">
                                        Nenhum projeto informado para este clube.
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <Users size={22} />
                                    <h2 className="text-2xl font-semibold">Equipe</h2>
                                </div>
                                {clubResearchers.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {clubResearchers.map(
                                            (researcher, researcherIndex) => (
                                                <article
                                                    key={researcher.id || researcherIndex}
                                                    className="flex items-center gap-3 rounded-md border bg-white p-4 shadow-xs">
                                                    <div className="bg-secondary text-secondary-foreground flex size-10 shrink-0 items-center justify-center rounded-full">
                                                        <BookOpen size={19} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold">
                                                            {researcher.name ||
                                                                "Nome ainda não informado"}
                                                        </p>
                                                        <p className="text-font-primary/60 text-xs">
                                                            {researcher.type ||
                                                                "Função ainda não informada"}
                                                        </p>
                                                    </div>
                                                </article>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-font-primary/60 rounded-md border border-dashed p-4 text-sm">
                                        Nenhum integrante vinculado aos projetos deste
                                        clube.
                                    </p>
                                )}
                            </div>
                        </section>
                    );
                })
            )}

            {equipments.length > 0 && (
                <section className="bg-foreground flex flex-col gap-4 rounded-md border p-5 sm:p-8">
                    <div className="flex items-center gap-2">
                        <Printer size={22} />
                        <h2 className="text-2xl font-semibold">
                            Estrutura disponível na escola
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {equipments.map((equipment, equipmentIndex) => (
                            <article
                                key={equipment.id || equipmentIndex}
                                className="rounded-md border bg-white p-4 shadow-xs">
                                <p className="font-semibold">
                                    {equipment.name || "Equipamento ainda sem nome"}
                                </p>
                                {equipment.quantity ? (
                                    <p className="text-font-primary/60 mt-1 text-sm">
                                        Quantidade: {equipment.quantity}
                                    </p>
                                ) : null}
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <div className="sticky bottom-4 rounded-md border bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50">
                    <ArrowLeft size={16} /> Voltar para edição
                </button>
            </div>
        </div>
    );
}
