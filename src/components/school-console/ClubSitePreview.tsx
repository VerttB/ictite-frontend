"use client";

import useSWR from "swr";
import Image from "next/image";

import {
    BookA,
    BookOpen,
    BookOpenText,
    BrainCircuit,
    Eye,
    FlaskConical,
    HeartHandshake,
    Instagram,
    Maximize2,
    PanelsTopLeft,
    School,
    ArrowLeft,
} from "lucide-react";

import { ImageDisplay } from "@/components/ui/ImageDisplay";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";
import { SchoolFormDataInput } from "@/schemas/schoolSubmissionSchema";

interface DraftClubImageProps {
    entityId: string;
    alt: string;
}

function DraftClubImage({ entityId, alt }: DraftClubImageProps) {
    const { data, isLoading } = useSWR(
        entityId ? `/submissions/current/images/clube_ciencias/${entityId}` : null,
        () => schoolSubmissionService.getFormEntityImages("clube_ciencias", entityId)
    );

    if (isLoading) {
        return (
            <div className="h-72 w-92 shrink-0 animate-pulse rounded-lg bg-gray-100 max-md:h-48 max-md:w-full" />
        );
    }

    const primaryImage = data?.images?.[0];

    if (!primaryImage) {
        return (
            <div className="text-font-primary/60 flex h-72 w-92 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 text-center text-sm max-md:h-48 max-md:w-full">
                <span>Sem imagem disponível</span>
            </div>
        );
    }

    return (
        <ImageDisplay
            src={primaryImage.url}
            alt={alt}
            className="h-72 w-92 shrink-0 overflow-hidden rounded-lg border-2 border-white/60 bg-white shadow-sm max-md:h-48 max-md:w-full"
        />
    );
}

function DraftClubGallery({ entityId, alt }: DraftClubImageProps) {
    const { data } = useSWR(
        entityId ? `/submissions/current/images/clube_ciencias/${entityId}` : null,
        () => schoolSubmissionService.getFormEntityImages("clube_ciencias", entityId)
    );
    const images = data?.images || [];

    if (images.length === 0) {
        return null;
    }

    return (
        <div className="flex border-t pt-4">
            <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-hidden">
                {images.map((image, index) => (
                    <Popover key={index}>
                        <PopoverTrigger>
                            <ImageDisplay
                                src={image.url}
                                alt={alt}
                                className="border-2"
                            />
                        </PopoverTrigger>
                        <PopoverContent>
                            <Image src={image.url} alt={alt} height={1000} width={1000} />
                        </PopoverContent>
                    </Popover>
                ))}
            </div>
        </div>
    );
}

interface ClubSitePreviewProps {
    data: SchoolFormDataInput;
    onBack?: () => void;
}

export function ClubSitePreview({ data, onBack }: ClubSitePreviewProps) {
    const clubs = data.clubs || [];
    const projects = data.projects || [];
    const researchers = data.researchers || [];

    return (
        <div className="animate-fade-in flex w-full flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-md p-3">
                        <Eye size={26} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Prévia do Portal</h2>
                        <p className="text-font-primary/60 text-sm">
                            Demonstração com as informações atuais do rascunho da escola.
                        </p>
                    </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-md border border-yellow-100 bg-yellow-50/40 px-3 py-2 text-xs font-semibold text-yellow-700/70">
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
                    const indicators = [
                        {
                            label: "Estudantes",
                            value: clubResearchers.filter(
                                (researcher) => researcher.type === "Aluno"
                            ).length,
                            Icon: BookA,
                        },
                        {
                            label: "Professores",
                            value: clubResearchers.filter(
                                (researcher) => researcher.type === "Professor"
                            ).length,
                            Icon: BookOpenText,
                        },
                        {
                            label: "Facilitadores",
                            value: clubResearchers.filter(
                                (researcher) => researcher.type === "Facilitador"
                            ).length,
                            Icon: HeartHandshake,
                        },
                        {
                            label: "Projetos",
                            value: clubProjects.length,
                            Icon: PanelsTopLeft,
                        },
                    ];
                    const researcherGroups = [
                        { label: "Professor", type: "Professor" },
                        { label: "Aluno", type: "Aluno" },
                        { label: "Facilitador", type: "Facilitador" },
                    ] as const;

                    return (
                        <section
                            key={club.id || clubIndex}
                            className="bg-foreground flex flex-col gap-8 rounded-md border p-5 sm:p-8">
                            <div className="flex flex-col items-center gap-5 border-b pb-8 md:flex-row">
                                <DraftClubImage
                                    entityId={club.id}
                                    alt={`Imagem do clube ${club.name || "de ciência"}`}
                                />
                                <div className="flex min-w-0 flex-col gap-2">
                                    <h1 className="text-center text-3xl font-semibold md:text-left md:text-4xl">
                                        {club.name || "Nome do clube ainda não informado"}
                                    </h1>
                                    <div className="text-primary flex flex-col gap-2 text-sm md:flex-row md:items-center">
                                        <span className="flex items-center gap-2 md:border-r md:pr-5">
                                            <School size={20} />
                                            {data.school?.name ||
                                                "Escola ainda não informada"}
                                        </span>
                                        {club.instagram_url && (
                                            <span className="flex items-center gap-2 md:border-r md:px-5">
                                                <Instagram size={20} />
                                                {club.instagram_url}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <DraftClubGallery
                                entityId={club.id}
                                alt={`Imagem do clube ${club.name || "de ciência"}`}
                            />

                            <div className="flex flex-col gap-2 rounded-md border p-3">
                                <p className="border-b pb-2 text-xl font-semibold">
                                    Descrição:
                                </p>
                                <p className="text-lg">
                                    {club.description ||
                                        data.school?.description ||
                                        "Descrição ainda não informada."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 rounded-md border p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
                                {indicators.map(({ label, value, Icon }) => (
                                    <div
                                        key={label}
                                        className="bg-primary flex flex-col items-center rounded-md border p-3 text-center text-white">
                                        <Icon />
                                        <span className="text-xl font-light">
                                            {label}
                                        </span>
                                        <span className="text-4xl font-extrabold">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <PanelsTopLeft size={22} />
                                    <h2 className="text-2xl font-semibold">Projetos:</h2>
                                </div>
                                {clubProjects.length > 0 ? (
                                    <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-4">
                                        {clubProjects.map((project, projectIndex) => (
                                            <article
                                                key={project.id || projectIndex}
                                                className="flex h-full flex-col justify-center gap-4 rounded-md border border-l-8 border-l-amber-500 bg-white p-5 shadow">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="text-2xl">
                                                        {project.name ||
                                                            "Projeto ainda sem nome"}
                                                    </h3>
                                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-red-400">
                                                        <Maximize2 size={18} />
                                                    </span>
                                                </div>
                                                {project.description && (
                                                    <p className="text-font-primary">
                                                        {project.description}
                                                    </p>
                                                )}
                                                <span className="text-font-secondary flex items-center gap-2 text-sm">
                                                    <BrainCircuit size={16} />
                                                    {club.name || "Clube ainda sem nome"}
                                                </span>
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
                                    <BookOpen size={22} />
                                    <h2 className="text-2xl font-semibold">
                                        Pesquisadores:
                                    </h2>
                                </div>
                                {clubResearchers.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {researcherGroups.map((group) => {
                                            const groupResearchers =
                                                clubResearchers.filter(
                                                    (researcher) =>
                                                        researcher.type === group.type
                                                );

                                            if (groupResearchers.length === 0) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    key={group.type}
                                                    className="flex flex-col gap-2 border-b pb-4">
                                                    <h3 className="text-xl font-semibold">
                                                        {group.label}
                                                    </h3>
                                                    <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                                        {groupResearchers.map(
                                                            (
                                                                researcher,
                                                                researcherIndex
                                                            ) => (
                                                                <article
                                                                    key={
                                                                        researcher.id ||
                                                                        researcherIndex
                                                                    }
                                                                    className="relative flex min-h-[300px] max-w-[210px] flex-col justify-end overflow-hidden rounded-md border-2 bg-black p-4 text-white">
                                                                    <p className="text-xl">
                                                                        {researcher.name ||
                                                                            "Nome ainda não informado"}
                                                                    </p>
                                                                    <span className="bg-secondary mt-2 flex w-fit items-center gap-2 rounded-sm px-3 py-1 text-white">
                                                                        <BookOpen
                                                                            size={20}
                                                                        />
                                                                        {researcher.type}
                                                                    </span>
                                                                </article>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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

            {onBack && (
                <div className="sticky bottom-4 rounded-md border bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50">
                        <ArrowLeft size={16} /> Voltar para edição
                    </button>
                </div>
            )}
        </div>
    );
}
