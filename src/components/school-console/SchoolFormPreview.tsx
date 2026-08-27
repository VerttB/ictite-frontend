"use client";

import useSWR from "swr";
import {
    AlertTriangle,
    ArrowLeft,
    BookOpen,
    Building2,
    CheckCircle2,
    Eye,
    Handshake,
    Loader2,
    Printer,
    School,
    Send,
    SquareChartGantt,
    Users,
} from "lucide-react";

import { getEquipamentTypes } from "@/core/service/TipoEquipamentoService";
import { EquipmentType } from "@/core/domain/EquipmentType";
import { getTerritories } from "@/core/service/IdentityTerritoryService";
import { IdentityTerritory } from "@/core/domain/IdentityTerritory";
import { SchoolFormDataInput } from "@/schemas/schoolSubmissionSchema";

interface SchoolFormPreviewProps {
    data: SchoolFormDataInput;
    mode: "preview" | "review";
    isSubmitting: boolean;
    onBack: () => void;
    onSubmit: () => void;
}

interface PreviewFieldProps {
    label: string;
    value?: string | number | null;
    wide?: boolean;
}

function PreviewField({ label, value, wide = false }: PreviewFieldProps) {
    const hasValue = value !== undefined && value !== null && String(value).trim() !== "";

    return (
        <div className={wide ? "sm:col-span-2" : undefined}>
            <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                {label}
            </p>
            <p
                className={
                    hasValue
                        ? "mt-1 text-sm text-gray-800"
                        : "mt-1 text-sm text-gray-400 italic"
                }>
                {hasValue ? value : "Não informado"}
            </p>
        </div>
    );
}

function EmptySection({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-4 text-xs font-semibold text-amber-700">
            <AlertTriangle size={16} />
            {label} ainda não informado.
        </div>
    );
}

function SectionHeader({
    icon,
    title,
    count,
}: {
    icon: React.ReactNode;
    title: string;
    count?: number;
}) {
    return (
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <span className="text-[#088077]">{icon}</span>
                {title}
            </h3>
            {count !== undefined && (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600">
                    {count} {count === 1 ? "item" : "itens"}
                </span>
            )}
        </div>
    );
}

export function getSchoolFormPendingSections(data: SchoolFormDataInput): string[] {
    const clubs = data.clubs || [];
    const projects = data.projects || [];
    const researchers = data.researchers || [];
    const equipments = data.equipments || [];
    const pending: string[] = [];

    if (!data.school?.name || data.school.name.trim().length < 2) {
        pending.push("dados principais da escola");
    }
    if (
        clubs.length === 0 ||
        clubs.some((club) => !club.name || club.name.trim().length < 2)
    ) {
        pending.push("clubes de ciência");
    }
    if (
        projects.length === 0 ||
        projects.some(
            (project) =>
                !project.name ||
                project.name.trim().length < 2 ||
                !project.clube_ciencia_id ||
                project.clube_ciencia_id === "disabled"
        )
    ) {
        pending.push("projetos de pesquisa");
    }
    if (
        researchers.length === 0 ||
        researchers.some(
            (researcher) =>
                !researcher.name || researcher.name.trim().length < 2 || !researcher.type
        )
    ) {
        pending.push("pesquisadores");
    }
    if (
        equipments.some(
            (equipment) =>
                !equipment.name ||
                equipment.name.trim().length < 2 ||
                !equipment.type_equipment_id ||
                !equipment.quantity
        )
    ) {
        pending.push("equipamentos");
    }

    return pending;
}

export function SchoolFormPreview({
    data,
    mode,
    isSubmitting,
    onBack,
    onSubmit,
}: SchoolFormPreviewProps) {
    const clubs = data.clubs || [];
    const projects = data.projects || [];
    const researchers = data.researchers || [];
    const equipments = data.equipments || [];
    const pendingSections = getSchoolFormPendingSections(data);
    const canSubmit = pendingSections.length === 0;

    const { data: equipmentTypes = [] } = useSWR<EquipmentType[]>(
        equipments.length > 0 ? "/equipment-types/" : null,
        getEquipamentTypes
    );

    const { data: territories = [] } = useSWR<IdentityTerritory[]>(
        "identity-territories",
        getTerritories
    );

    const territoryMap = new Map(
        territories.map((t) => [t.id, `${t.code} — ${t.name}`])
    );
    const territoryName = data.school?.identity_territory_id
        ? territoryMap.get(data.school.identity_territory_id) || null
        : null;

    const clubNames = new Map(clubs.map((club) => [club.id, club.name]));
    const projectNames = new Map(projects.map((project) => [project.id, project.name]));
    const equipmentTypeNames = new Map(
        equipmentTypes.map((equipmentType) => [equipmentType.id, equipmentType.name])
    );

    return (
        <div className="animate-fade-in flex w-full flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#088077]/10 p-3 text-[#088077]">
                        {mode === "review" ? <BookOpen size={28} /> : <Eye size={28} />}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {mode === "review"
                                ? "Revisar e enviar"
                                : "Pré-visualização do formulário"}
                        </h2>
                        <p className="text-xs text-gray-500">
                            Visualização somente leitura dos dados atuais do rascunho.
                        </p>
                    </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-600">
                    <Eye size={14} /> Somente leitura
                </span>
            </div>

            {pendingSections.length > 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-800">
                    <p className="flex items-center gap-2 font-bold">
                        <AlertTriangle size={16} /> Existem partes ainda incompletas
                    </p>
                    <p className="mt-1 pl-6">
                        {pendingSections.join(", ")}. Volte à edição para concluir as
                        informações.
                    </p>
                </div>
            ) : (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs font-bold text-emerald-700">
                    <CheckCircle2 size={16} /> As seções do formulário estão prontas para
                    envio.
                </div>
            )}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeader
                    icon={<School size={19} />}
                    title="Dados principais da escola"
                />
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <PreviewField label="Nome da escola" value={data.school?.name} wide />
                    <PreviewField label="Cidade" value={data.school?.city} />
                    <PreviewField label="CEP" value={data.school?.cep} />
                    <PreviewField
                        label="Território de Identidade"
                        value={territoryName}
                        wide
                    />
                    <PreviewField
                        label="Instagram"
                        value={data.school?.instagram_url}
                        wide
                    />
                    <PreviewField
                        label="Descrição"
                        value={data.school?.description}
                        wide
                    />
                </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeader
                    icon={<Handshake size={19} />}
                    title="Clubes de Ciência"
                    count={clubs.length}
                />
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {clubs.length === 0 ? (
                        <div className="lg:col-span-2">
                            <EmptySection label="Clube de Ciência" />
                        </div>
                    ) : (
                        clubs.map((club, index) => (
                            <div
                                key={club.id || index}
                                className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                                <PreviewField
                                    label={`Clube ${index + 1}`}
                                    value={club.name}
                                />
                                <div className="mt-3">
                                    <PreviewField
                                        label="Instagram"
                                        value={club.instagram_url}
                                    />
                                </div>
                                <div className="mt-3">
                                    <PreviewField
                                        label="Descrição"
                                        value={club.description}
                                        wide
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeader
                    icon={<SquareChartGantt size={19} />}
                    title="Projetos de Pesquisa"
                    count={projects.length}
                />
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {projects.length === 0 ? (
                        <div className="lg:col-span-2">
                            <EmptySection label="Projeto de Pesquisa" />
                        </div>
                    ) : (
                        projects.map((project, index) => (
                            <div
                                key={project.id || index}
                                className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <PreviewField
                                        label={`Projeto ${index + 1}`}
                                        value={project.name}
                                    />
                                    <PreviewField label="Ano" value={project.year} />
                                    <PreviewField
                                        label="Clube vinculado"
                                        value={
                                            clubNames.get(project.clube_ciencia_id) ||
                                            null
                                        }
                                        wide
                                    />
                                    <PreviewField
                                        label="Descrição Curta"
                                        value={project.description}
                                        wide
                                    />
                                    <PreviewField
                                        label="Descrição Longa"
                                        value={project.long_description}
                                        wide
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeader
                    icon={<Users size={19} />}
                    title="Pesquisadores"
                    count={researchers.length}
                />
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {researchers.length === 0 ? (
                        <div className="lg:col-span-2">
                            <EmptySection label="Pesquisador" />
                        </div>
                    ) : (
                        researchers.map((researcher, index) => {
                            const linkedProjects = (researcher.project_ids || [])
                                .map((projectId) => projectNames.get(projectId))
                                .filter(Boolean)
                                .join(", ");

                            return (
                                <div
                                    key={researcher.id || index}
                                    className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <PreviewField
                                            label={`Pesquisador ${index + 1}`}
                                            value={researcher.name}
                                        />
                                        <PreviewField
                                            label="Função / tipo"
                                            value={researcher.type}
                                        />
                                        <PreviewField
                                            label="Gênero"
                                            value={researcher.gender}
                                        />
                                        <PreviewField
                                            label="Raça / cor"
                                            value={researcher.race}
                                        />
                                        <PreviewField
                                            label="Lattes"
                                            value={researcher.lattes_id}
                                        />
                                        <PreviewField
                                            label="Projetos vinculados"
                                            value={linkedProjects}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeader
                    icon={<Printer size={19} />}
                    title="Equipamentos"
                    count={equipments.length}
                />
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {equipments.length === 0 ? (
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-4 text-xs font-semibold text-gray-500">
                                <Building2 size={16} /> Nenhum equipamento informado
                                (seção opcional).
                            </div>
                        </div>
                    ) : (
                        equipments.map((equipment, index) => (
                            <div
                                key={equipment.id || index}
                                className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <PreviewField
                                        label={`Equipamento ${index + 1}`}
                                        value={equipment.name}
                                    />
                                    <PreviewField
                                        label="Tipo"
                                        value={
                                            equipmentTypeNames.get(
                                                equipment.type_equipment_id
                                            ) || null
                                        }
                                    />
                                    <PreviewField
                                        label="Quantidade"
                                        value={equipment.quantity}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50">
                    <ArrowLeft size={16} /> Continuar editando
                </button>

                {mode === "review" && (
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!canSubmit || isSubmitting}
                        title={
                            !canSubmit
                                ? "Conclua as partes pendentes antes de enviar"
                                : undefined
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-[#088077] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#088077]/90 disabled:cursor-not-allowed disabled:opacity-50">
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Send size={16} />
                        )}
                        Enviar para análise
                    </button>
                )}
            </div>
        </div>
    );
}
