"use client";

import useSWR from "swr";
import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import {
    BookA,
    BookOpen,
    BookOpenText,
    BrainCircuit,
    Eye,
    ExternalLink,
    HeartHandshake,
    Instagram,
    Map as MapIcon,
    MapPin,
    Maximize2,
    PanelsTopLeft,
    Printer,
    School,
    ArrowLeft,
} from "lucide-react";

import { ImageDisplay } from "@/components/ui/ImageDisplay";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";
import { SchoolFormDataInput } from "@/schemas/schoolSubmissionSchema";
import { getTerritories } from "@/core/service/IdentityTerritoryService";
import { IdentityTerritory } from "@/core/domain/IdentityTerritory";
import { EquipmentType } from "@/core/domain/EquipmentType";
import { getEquipamentTypes } from "@/core/service/TipoEquipamentoService";

type PreviewProject = SchoolFormDataInput["projects"][number];

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
    const galleryImages = images.slice(1);

    if (galleryImages.length === 0) {
        return null;
    }

    return (
        <div className="flex border-t pt-4">
            <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-hidden">
                {galleryImages.map((image, index) => (
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

function DraftProjectImage({
    entityId,
    alt,
    expanded = false,
}: DraftClubImageProps & { expanded?: boolean }) {
    const { data, isLoading } = useSWR(
        entityId ? `/submissions/current/images/project/${entityId}` : null,
        () => schoolSubmissionService.getFormEntityImages("project", entityId)
    );

    if (isLoading) {
        return (
            <div
                className={`w-full animate-pulse rounded-md bg-gray-100 ${expanded ? "h-96" : "h-40"}`}
            />
        );
    }

    const primaryImage = data?.images?.[0];

    if (!primaryImage) {
        return (
            <div
                className={`text-font-primary/60 flex w-full items-center justify-center rounded-md border-2 border-dashed border-gray-200 bg-gray-50 text-center text-xs ${expanded ? "h-96" : "h-40"}`}>
                Sem imagem disponível
            </div>
        );
    }

    return (
        <ImageDisplay
            src={primaryImage.url}
            alt={alt}
            className={`w-full overflow-hidden rounded-md border bg-gray-50 ${expanded ? "h-96" : "h-40"}`}
        />
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
    const equipments = data.equipments || [];
    const [expandedProject, setExpandedProject] = useState<PreviewProject | null>(null);
    const [activeTab, setActiveTab] = useState("clubes");
    const { data: schoolImage } = useSWR("/submissions/current/image", () =>
        schoolSubmissionService.getFormImage()
    );
    const { data: territories = [] } = useSWR<IdentityTerritory[]>(
        "identity-territories",
        getTerritories
    );
    const { data: equipmentTypes = [] } = useSWR<EquipmentType[]>(
        equipments.length > 0 ? "/equipment-types/" : null,
        getEquipamentTypes
    );
    const territoryName = territories.find(
        (territory) => territory.id === data.school?.identity_territory_id
    )?.name;
    const equipmentTypeNames = new Map(
        equipmentTypes.map((equipmentType) => [equipmentType.id, equipmentType.name])
    );
    const schoolStats = [
        { label: "Clubes de Ciência", value: clubs.length, Icon: BrainCircuit },
        { label: "Pesquisadores", value: researchers.length, Icon: BookOpen },
        { label: "Projetos", value: projects.length, Icon: PanelsTopLeft },
        { label: "Equipamentos", value: equipments.length, Icon: Printer },
    ];
    const tabs = [
        { value: "clubes", label: "Clubes de Ciência", icon: BrainCircuit },
        { value: "pesquisadores", label: "Pesquisadores", icon: BookOpen },
        { value: "equipamentos", label: "Equipamentos", icon: Printer },
        { value: "projetos", label: "Projetos", icon: PanelsTopLeft },
    ];

    return (
        <div className="animate-fade-in flex w-full flex-col gap-6">
            <div className="bg-card border-border flex flex-wrap items-center justify-between gap-4 rounded-md border p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-md p-3">
                        <Eye size={26} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Prévia do Portal</h2>
                        <p className="text-font-secondary text-sm">
                            Prévia da página pública com os dados atuais do rascunho.
                        </p>
                    </div>
                </div>
                <span className="text-font-secondary border-border bg-muted inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold">
                    <Eye size={15} /> Ainda não publicada
                </span>
            </div>

            <section className="bg-foreground flex flex-col gap-5 rounded-md border p-5 sm:flex-row sm:items-start sm:p-6">
                <div className="bg-background h-48 w-full shrink-0 overflow-hidden rounded-md border sm:h-56 sm:w-72">
                    {schoolImage?.url ? (
                        <ImageDisplay
                            src={schoolImage.url}
                            alt={`Imagem da escola ${data.school?.name || ""}`}
                            className="h-full w-full rounded-none"
                        />
                    ) : (
                        <div className="text-font-secondary flex h-full flex-col items-center justify-center gap-2 text-sm">
                            <School size={28} />
                            <span>Sem imagem da escola</span>
                        </div>
                    )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div>
                        <h1 className="text-font-primary text-2xl font-semibold">
                            {data.school?.name || "Escola ainda não informada"}
                        </h1>
                        <div className="text-font-secondary mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                            <span className="flex items-center gap-2">
                                <MapPin size={16} />
                                {data.school?.city || "Cidade não informada"}
                            </span>
                            {data.school?.instagram_url && (
                                <span className="flex items-center gap-2">
                                    <Instagram size={16} />
                                    {data.school.instagram_url}
                                </span>
                            )}
                            {data.school?.cep && (
                                <span className="flex items-center gap-2">
                                    <Printer size={16} /> CEP: {data.school.cep}
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <MapIcon size={16} />
                                Território: {territoryName || "Não definido"}
                            </span>
                        </div>
                    </div>
                    <p className="text-font-primary/80 text-sm leading-relaxed whitespace-pre-wrap">
                        {data.school?.description ||
                            "Descrição da escola ainda não informada."}
                    </p>
                </div>
            </section>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(220px,3fr)]">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="min-w-0">
                    <TabsList className="bg-accent flex w-full gap-2 overflow-x-auto rounded-md p-2">
                        {tabs.map(({ value, label, icon: Icon }) => (
                            <TabsTrigger key={value} value={value} asChild>
                                <Button
                                    variant={activeTab === value ? "default" : "outline"}
                                    className="shrink-0 gap-2">
                                    <Icon size={16} />
                                    <span>{label}</span>
                                </Button>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="clubes" className="mt-5">
                        {clubs.length === 0 ? (
                            <p className="text-font-secondary rounded-md border border-dashed p-5 text-sm">
                                Nenhum Clube de Ciência foi informado neste rascunho.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {clubs.map((club, clubIndex) => {
                                    const clubProjects = projects.filter(
                                        (project) => project.clube_ciencia_id === club.id
                                    );
                                    const projectIds = new Set(
                                        clubProjects.map((project) => project.id)
                                    );
                                    const clubResearchers = researchers.filter(
                                        (researcher) =>
                                            (researcher.project_ids || []).some(
                                                (projectId) => projectIds.has(projectId)
                                            )
                                    );
                                    const indicators = [
                                        {
                                            label: "Estudantes",
                                            value: clubResearchers.filter(
                                                (researcher) =>
                                                    researcher.type === "Aluno"
                                            ).length,
                                            Icon: BookA,
                                        },
                                        {
                                            label: "Professores",
                                            value: clubResearchers.filter(
                                                (researcher) =>
                                                    researcher.type === "Professor"
                                            ).length,
                                            Icon: BookOpenText,
                                        },
                                        {
                                            label: "Facilitadores",
                                            value: clubResearchers.filter(
                                                (researcher) =>
                                                    researcher.type === "Facilitador"
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
                                            className="bg-foreground flex flex-col gap-6 rounded-md border p-5 sm:p-6">
                                            <div className="flex flex-col items-center gap-5 border-b pb-8 md:flex-row">
                                                <DraftClubImage
                                                    entityId={club.id}
                                                    alt={`Imagem do clube ${club.name || "de ciência"}`}
                                                />
                                                <div className="flex min-w-0 flex-col gap-2">
                                                    <h1 className="text-center text-3xl font-semibold md:text-left md:text-4xl">
                                                        {club.name ||
                                                            "Nome do clube ainda não informado"}
                                                    </h1>
                                                    <div className="text-primary flex flex-col gap-2 text-sm md:flex-row md:items-center">
                                                        {club.instagram_url && (
                                                            <span className="flex items-center gap-2">
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
                                                {indicators.map(
                                                    ({ label, value, Icon }) => (
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
                                                    )
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-2">
                                                    <PanelsTopLeft size={22} />
                                                    <h2 className="text-2xl font-semibold">
                                                        Projetos:
                                                    </h2>
                                                </div>
                                                {clubProjects.length > 0 ? (
                                                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                                        {clubProjects.map(
                                                            (project, projectIndex) => (
                                                                <article
                                                                    key={
                                                                        project.id ||
                                                                        projectIndex
                                                                    }
                                                                    className="flex h-full min-w-0 flex-col gap-4 rounded-md border border-l-8 border-l-amber-500 bg-white p-5 shadow">
                                                                    <DraftProjectImage
                                                                        entityId={
                                                                            project.id
                                                                        }
                                                                        alt={`Imagem do projeto ${project.name || "de pesquisa"}`}
                                                                    />
                                                                    <div className="flex items-start justify-between gap-3">
                                                                        <h3 className="text-2xl">
                                                                            {project.name ||
                                                                                "Projeto ainda sem nome"}
                                                                        </h3>
                                                                        <button
                                                                            type="button"
                                                                            aria-label={`Ampliar projeto ${project.name || ""}`}
                                                                            title="Ampliar projeto"
                                                                            onClick={() =>
                                                                                setExpandedProject(
                                                                                    project
                                                                                )
                                                                            }
                                                                            className="text-font-primary border-border hover:bg-muted flex size-10 shrink-0 items-center justify-center rounded-md border transition-colors">
                                                                            <Maximize2
                                                                                size={18}
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                    {project.description && (
                                                                        <p className="text-font-primary">
                                                                            {
                                                                                project.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    <span className="text-font-secondary flex items-center gap-2 text-sm">
                                                                        <BrainCircuit
                                                                            size={16}
                                                                        />
                                                                        {club.name ||
                                                                            "Clube ainda sem nome"}
                                                                    </span>
                                                                </article>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-font-primary/60 rounded-md border border-dashed p-4 text-sm">
                                                        Nenhum projeto informado para este
                                                        clube.
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
                                                                        researcher.type ===
                                                                        group.type
                                                                );

                                                            if (
                                                                groupResearchers.length ===
                                                                0
                                                            ) {
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
                                                                                    className="bg-background text-font-primary relative flex min-h-[300px] min-w-0 flex-col justify-end overflow-hidden rounded-md border-2 p-4">
                                                                                    {researcher.image && (
                                                                                        <ImageDisplay
                                                                                            src={
                                                                                                researcher.image
                                                                                            }
                                                                                            alt={`Foto de ${researcher.name || "pesquisador"}`}
                                                                                            className="absolute inset-0 h-full w-full rounded-none"
                                                                                        />
                                                                                    )}
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                                                    <div className="relative z-10 text-white">
                                                                                        <p className="text-xl">
                                                                                            {researcher.name ||
                                                                                                "Nome ainda não informado"}
                                                                                        </p>
                                                                                        <span className="bg-secondary mt-2 flex w-fit items-center gap-2 rounded-sm px-3 py-1 text-white">
                                                                                            <BookOpen
                                                                                                size={
                                                                                                    20
                                                                                                }
                                                                                            />
                                                                                            {
                                                                                                researcher.type
                                                                                            }
                                                                                        </span>
                                                                                        {researcher.lattes_id && (
                                                                                            <a
                                                                                                href={`https://lattes.cnpq.br/${researcher.lattes_id.replace(/\D/g, "")}`}
                                                                                                target="_blank"
                                                                                                rel="noreferrer"
                                                                                                className="mt-3 inline-flex items-center gap-2 rounded-sm bg-white/15 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/25">
                                                                                                <ExternalLink
                                                                                                    size={
                                                                                                        15
                                                                                                    }
                                                                                                />
                                                                                                Currículo
                                                                                                Lattes
                                                                                            </a>
                                                                                        )}
                                                                                    </div>
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
                                                        Nenhum integrante vinculado aos
                                                        projetos deste clube.
                                                    </p>
                                                )}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="pesquisadores" className="mt-5">
                        {researchers.length === 0 ? (
                            <p className="text-font-secondary rounded-md border border-dashed p-5 text-sm">
                                Nenhum pesquisador informado.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {researchers.map((researcher, index) => (
                                    <article
                                        key={researcher.id || index}
                                        className="bg-foreground flex min-w-0 items-center gap-4 rounded-md border p-4">
                                        {researcher.image ? (
                                            <ImageDisplay
                                                src={researcher.image}
                                                alt={`Foto de ${researcher.name}`}
                                                className="size-20 shrink-0 overflow-hidden rounded-full"
                                            />
                                        ) : (
                                            <div className="text-font-secondary bg-background flex size-20 shrink-0 items-center justify-center rounded-full border">
                                                <BookOpen />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="text-font-primary truncate font-semibold">
                                                {researcher.name || "Nome não informado"}
                                            </h3>
                                            <p className="text-font-secondary text-sm">
                                                {researcher.type}
                                            </p>
                                            {researcher.lattes_id && (
                                                <a
                                                    href={`https://lattes.cnpq.br/${researcher.lattes_id.replace(/\D/g, "")}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-primary mt-2 inline-flex items-center gap-1 text-xs hover:underline">
                                                    <ExternalLink size={13} /> Currículo
                                                    Lattes
                                                </a>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="equipamentos" className="mt-5">
                        {equipments.length === 0 ? (
                            <p className="text-font-secondary rounded-md border border-dashed p-5 text-sm">
                                Nenhum equipamento informado.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {equipments.map((equipment, index) => (
                                    <article
                                        key={equipment.id || index}
                                        className="bg-foreground flex items-center gap-4 rounded-md border p-4">
                                        <Printer
                                            className="text-primary shrink-0"
                                            size={22}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-font-primary font-semibold">
                                                {equipment.name}
                                            </h3>
                                            <p className="text-font-secondary text-sm">
                                                {equipmentTypeNames.get(
                                                    equipment.type_equipment_id
                                                ) || "Tipo não informado"}
                                            </p>
                                        </div>
                                        <span className="text-font-primary text-sm font-semibold">
                                            {equipment.quantity} un.
                                        </span>
                                    </article>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="projetos" className="mt-5">
                        {projects.length === 0 ? (
                            <p className="text-font-secondary rounded-md border border-dashed p-5 text-sm">
                                Nenhum projeto informado.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {projects.map((project, index) => (
                                    <article
                                        key={project.id || index}
                                        className="bg-foreground flex min-w-0 flex-col gap-3 rounded-md border border-l-4 border-l-amber-500 p-4">
                                        <DraftProjectImage
                                            entityId={project.id}
                                            alt={`Imagem do projeto ${project.name || "de pesquisa"}`}
                                        />
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-font-primary text-lg font-semibold">
                                                {project.name || "Projeto ainda sem nome"}
                                            </h3>
                                            <button
                                                type="button"
                                                aria-label={`Ampliar projeto ${project.name || ""}`}
                                                title="Ampliar projeto"
                                                onClick={() =>
                                                    setExpandedProject(project)
                                                }
                                                className="text-font-primary border-border hover:bg-muted flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors">
                                                <Maximize2 size={17} />
                                            </button>
                                        </div>
                                        {project.description && (
                                            <p className="text-font-primary text-sm">
                                                {project.description}
                                            </p>
                                        )}
                                        <span className="text-font-secondary flex items-center gap-2 text-sm">
                                            <BrainCircuit size={15} />
                                            {clubs.find(
                                                (club) =>
                                                    club.id === project.clube_ciencia_id
                                            )?.name || "Clube não informado"}
                                        </span>
                                    </article>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <aside className="bg-foreground grid grid-cols-2 gap-3 rounded-md border p-4 lg:grid-cols-1">
                    {schoolStats.map(({ label, value, Icon }) => (
                        <div
                            key={label}
                            className="bg-primary flex items-center justify-between gap-3 rounded-md p-3 text-white">
                            <div className="flex min-w-0 items-center gap-2">
                                <Icon size={18} />
                                <span className="text-sm">{label}</span>
                            </div>
                            <strong className="text-xl">{value}</strong>
                        </div>
                    ))}
                </aside>
            </div>

            <Dialog
                open={expandedProject !== null}
                onOpenChange={(open) => {
                    if (!open) setExpandedProject(null);
                }}>
                <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{expandedProject?.name || "Projeto"}</DialogTitle>
                    </DialogHeader>
                    {expandedProject && (
                        <div className="space-y-5">
                            <DraftProjectImage
                                entityId={expandedProject.id}
                                alt={`Imagem do projeto ${expandedProject.name || "de pesquisa"}`}
                                expanded
                            />
                            {expandedProject.description && (
                                <p className="text-font-primary">
                                    {expandedProject.description}
                                </p>
                            )}
                            {expandedProject.long_description && (
                                <p className="text-font-primary whitespace-pre-wrap">
                                    {expandedProject.long_description}
                                </p>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

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
