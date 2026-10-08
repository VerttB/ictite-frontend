"use client";

import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FileText,
    CheckCircle2,
    AlertTriangle,
    Clock,
    ClipboardCheck,
    Calendar,
    AlertCircle,
    Hourglass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    SchoolFormSubmission,
    SchoolFormDataInput,
} from "@/schemas/schoolSubmissionSchema";

interface SchoolFormOverviewSectionProps {
    form: UseFormReturn<SchoolFormDataInput>;
    submission: SchoolFormSubmission | null;
    onOpenReview?: () => void;
}

function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateString;
    }
}

function getDaysRemaining(deadlineString: string | null | undefined): number | null {
    if (!deadlineString) return null;
    try {
        const deadline = new Date(deadlineString);
        const now = new Date();
        const diffTime = deadline.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
        return null;
    }
}

function getExtensionStatusText(
    extensionStatus: string | null | undefined,
    daysRemaining: number | null,
    customDeadline: string | null | undefined
): { label: string; variant: "default" | "warning" | "destructive" | "success"; icon: React.ReactNode } {
    if (extensionStatus === "Pendente") {
        return {
            label: "Prorrogação solicitada",
            variant: "warning",
            icon: <Hourglass size={14} />,
        };
    }
    if (extensionStatus === "Aprovado") {
        return {
            label: "Prorrogação aprovada",
            variant: "success",
            icon: <CheckCircle2 size={14} />,
        };
    }
    if (extensionStatus === "Rejeitado") {
        return {
            label: "Prorrogação rejeitada",
            variant: "destructive",
            icon: <AlertCircle size={14} />,
        };
    }
    if (daysRemaining !== null) {
        if (daysRemaining < 0) {
            return {
                label: `Prazo encerrado há ${Math.abs(daysRemaining)} dia(s)`,
                variant: "destructive",
                icon: <AlertTriangle size={14} />,
            };
        }
        if (daysRemaining <= 3) {
            return {
                label: `Restam ${daysRemaining} dia(s)`,
                variant: "warning",
                icon: <AlertTriangle size={14} />,
            };
        }
        return {
            label: `Restam ${daysRemaining} dia(s)`,
            variant: "default",
            icon: <Calendar size={14} />,
        };
    }
    if (customDeadline) {
        return {
            label: "Prazo personalizado definido",
            variant: "default",
            icon: <Calendar size={14} />,
        };
    }
    return {
        label: "Sem prazo definido",
        variant: "default",
        icon: <Calendar size={14} />,
    };
}

export function SchoolFormOverviewSection({
    form,
    submission,
    onOpenReview,
}: SchoolFormOverviewSectionProps) {
    const values = form.watch();
    const schoolName = values.school?.name || "Escola não nomeada";

    const clubs = values.clubs || [];
    const projects = values.projects || [];
    const researchers = values.researchers || [];
    const equipments = values.equipments || [];

    // Deadline information
    const customDeadline = submission?.custom_deadline ?? null;
    const extensionStatus = submission?.extension_status ?? null;
    const requestedDeadline = submission?.requested_deadline ?? null;
    const extensionRequestedAt = submission?.extension_requested_at ?? null;

    const effectiveDeadline = useMemo(() => {
        if (extensionStatus === "Aprovado" && requestedDeadline) return requestedDeadline;
        if (customDeadline) return customDeadline;
        return null;
    }, [customDeadline, extensionStatus, requestedDeadline]);

    const daysRemaining = useMemo(() => getDaysRemaining(effectiveDeadline), [effectiveDeadline]);
    const extensionInfo = useMemo(() => getExtensionStatusText(extensionStatus, daysRemaining, customDeadline), [extensionStatus, daysRemaining, customDeadline]);

    // --- Strict Section Validation ---

    // 1. Escola
    const isSchoolValid = !!values.school?.name && values.school.name.trim().length >= 2;

    // 2. Clubes de Ciência
    const incompleteClubsCount = clubs.filter(
        (c) => !c.name || c.name.trim().length < 2
    ).length;
    const isClubsValid = clubs.length > 0 && incompleteClubsCount === 0;

    // 3. Projetos de Pesquisa
    const incompleteProjectsCount = projects.filter(
        (p) =>
            !p.name ||
            p.name.trim().length < 2 ||
            !p.clube_ciencia_id ||
            p.clube_ciencia_id === "disabled"
    ).length;
    const isProjectsValid = projects.length > 0 && incompleteProjectsCount === 0;

    // 4. Pesquisadores
    const incompleteResearchersCount = researchers.filter(
        (r) => !r.name || r.name.trim().length < 2 || !r.type || !r.project_ids?.length
    ).length;
    const isResearchersValid = researchers.length > 0 && incompleteResearchersCount === 0;

    // 5. Equipamentos
    const incompleteEquipmentsCount = equipments.filter(
        (e) => !e.name || e.name.trim().length < 2 || !e.type_equipment_id || !e.quantity
    ).length;
    const isEquipmentsValid = equipments.length === 0 || incompleteEquipmentsCount === 0;

    // Overall completion percentage calculation based on actual field completeness
    const validSections = [
        isSchoolValid,
        isClubsValid,
        isProjectsValid,
        isResearchersValid,
        isEquipmentsValid,
    ].filter(Boolean).length;
    const completionPercentage = Math.round((validSections / 5) * 100);

    return (
        <div className="animate-fade-in flex w-full flex-col gap-6">
            {/* Prazo de Preenchimento - Destaque no Topo */}
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="bg-[#088077]/5 border-b border-border p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-[#088077]/10 p-3 text-[#088077]">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="text-font-primary text-lg font-bold">Prazo de Preenchimento</h3>
                                <p className="text-font-secondary text-xs">Data limite para envio do formulário da escola</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                            {effectiveDeadline ? (
                                <>
                                    <div className="flex items-center gap-2 text-right">
                                        <span className="text-font-primary text-sm font-semibold">
                                            {formatDateTime(effectiveDeadline)}
                                        </span>
                                        {extensionStatus === "Aprovado" && requestedDeadline && (
                                            <span className="bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5 text-[10px] font-bold">
                                                Prorrogado
                                            </span>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-1.5 font-semibold text-sm ${
                                        extensionInfo.variant === "destructive" ? "text-red-600" :
                                        extensionInfo.variant === "warning" ? "text-amber-600" :
                                        extensionInfo.variant === "success" ? "text-emerald-600" :
                                        "text-[#088077]"
                                    }`}>
                                        {extensionInfo.icon}
                                        {extensionInfo.label}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col sm:items-end gap-2">
                                    <span className="text-font-secondary text-sm">Não definido</span>
                                    <span className="flex items-center gap-1.5 font-semibold text-sm text-amber-600">
                                        <AlertCircle size={14} />
                                        {extensionInfo.label}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {(extensionStatus === "Pendente" || extensionRequestedAt) && requestedDeadline && (
                    <div className="bg-amber-50 border-t border-amber-200 p-4">
                        <div className="flex items-center gap-2 text-amber-800">
                            <Hourglass size={16} />
                            <span className="text-sm font-medium">
                                Prorrogação solicitada em {formatDateTime(extensionRequestedAt)} para {formatDateTime(requestedDeadline)} — aguardando análise.
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Header da Visão Geral do Formulário */}
            <div className="bg-card flex items-center justify-between rounded-3xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#088077]/10 p-3 text-[#088077]">
                        <FileText size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-font-primary text-lg font-bold">
                                Visão Geral do Formulário
                            </h2>
                            <span className="bg-muted text-font-secondary rounded-full px-2.5 py-0.5 text-xs font-bold">
                                Versão {submission?.version || 1}
                            </span>
                        </div>
                        <p className="text-font-secondary text-xs">
                            Status do rascunho e validação das informações pré-submissão
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-[#088077]">
                            {completionPercentage}% Concluído
                        </span>
                        <div className="mt-1 h-2 w-32 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full bg-[#088077] transition-all duration-300"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </div>
                    {onOpenReview && (
                        <Button type="button" onClick={onOpenReview}>
                            <ClipboardCheck size={16} />
                            Revisar e enviar
                        </Button>
                    )}
                </div>
            </div>

            {/* Checklist de Validação do Formulário */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-card flex flex-col gap-4 rounded-3xl border border-border p-6 shadow-sm">
                    <h3 className="text-font-primary flex items-center gap-2 text-sm font-bold">
                        <CheckCircle2 size={18} className="text-[#088077]" />
                        Validação das Seções do Formulário
                    </h3>

                    <div className="space-y-3 text-xs font-semibold">
                        {/* 1. Escola */}
                        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5">
                            <span className="text-font-primary">1. Cadastro da Escola</span>
                            {isSchoolValid ? (
                                <span className="flex items-center gap-1 font-bold text-emerald-600">
                                    <CheckCircle2 size={15} /> OK ({schoolName})
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 font-bold text-amber-600">
                                    <AlertTriangle size={15} /> Nome da escola pendente
                                </span>
                            )}
                        </div>

                        {/* 2. Clubes de Ciência */}
                        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5">
                            <span className="text-font-primary">2. Clubes de Ciência</span>
                            {clubs.length === 0 ? (
                                <span className="flex items-center gap-1 font-bold text-amber-600">
                                    <AlertTriangle size={15} /> Nenhum clube cadastrado
                                </span>
                            ) : incompleteClubsCount > 0 ? (
                                <span className="flex items-center gap-1 font-bold text-amber-600">
                                    <AlertTriangle size={15} /> {incompleteClubsCount} de{" "}
                                    {clubs.length} pendente(s)
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 font-bold text-emerald-600">
                                    <CheckCircle2 size={15} /> OK ({clubs.length} completo
                                    {clubs.length > 1 ? "s" : ""})
                                </span>
                            )}
                        </div>

                        {/* 3. Projetos de Pesquisa */}
                        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5">
                            <span className="text-font-primary">3. Projetos de Pesquisa</span>
                            {projects.length === 0 ? (
                                <span className="flex items-center gap-1 font-bold text-amber-600">
                                    <AlertTriangle size={15} /> Nenhum projeto cadastrado
                                </span>
                            ) : incompleteProjectsCount > 0 ? (
                                <span className="flex items-center gap-1 font-bold text-amber-600">
                                    <AlertTriangle size={15} /> {incompleteProjectsCount}{" "}
                                    de {projects.length} pendente(s)
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 font-bold text-emerald-600">
                                    <CheckCircle2 size={15} /> OK ({projects.length}{" "}
                                    completo{projects.length > 1 ? "s" : ""})
                                </span>
                            )}
                        </div>

                        {/* 4. Pesquisadores */}
                        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5">
                            <span className="text-font-primary">4. Pesquisadores</span>
                            {researchers.length === 0 ? (
                                <span className="flex items-center gap-1 font-bold text-amber-600">
                                    <AlertTriangle size={15} /> Nenhum pesquisador
                                    cadastrado
                                </span>
                            ) : incompleteResearchersCount > 0 ? (
                                <span className="flex items-center gap-1 font-bold text-amber-600">
                                    <AlertTriangle size={15} />{" "}
                                    {incompleteResearchersCount} de {researchers.length}{" "}
                                    pendente(s)
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 font-bold text-emerald-600">
                                    <CheckCircle2 size={15} /> OK ({researchers.length}{" "}
                                    completo{researchers.length > 1 ? "s" : ""})
                                </span>
                            )}
                        </div>

                        {/* 5. Equipamentos */}
                        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5">
                            <span className="text-font-primary">
                                5. Equipamentos Laboratoriais
                            </span>
                            {incompleteEquipmentsCount > 0 ? (
                                <span className="flex items-center gap-1 font-bold text-amber-600">
                                    <AlertTriangle size={15} />{" "}
                                    {incompleteEquipmentsCount} de {equipments.length}{" "}
                                    pendente(s)
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 font-bold text-emerald-600">
                                    <CheckCircle2 size={15} /> OK ({equipments.length}{" "}
                                    item{equipments.length !== 1 ? "s" : ""})
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resumo de Contagem de Itens no Rascunho */}
                <div className="bg-card flex flex-col gap-4 rounded-3xl border border-border p-6 shadow-sm">
                    <h3 className="text-font-primary flex items-center gap-2 text-sm font-bold">
                        <Clock size={18} className="text-[#088077]" />
                        Resumo dos Dados no Rascunho
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                            <span className="text-xs font-bold text-teal-800">
                                Clubes de Ciência
                            </span>
                            <span className="mt-1 text-2xl font-black text-teal-900">
                                {clubs.length}
                            </span>
                        </div>

                        <div className="flex flex-col rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                            <span className="text-xs font-bold text-blue-800">
                                Projetos de Pesquisa
                            </span>
                            <span className="mt-1 text-2xl font-black text-blue-900">
                                {projects.length}
                            </span>
                        </div>

                        <div className="flex flex-col rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
                            <span className="text-xs font-bold text-purple-800">
                                Pesquisadores
                            </span>
                            <span className="mt-1 text-2xl font-black text-purple-900">
                                {researchers.length}
                            </span>
                        </div>

                        <div className="flex flex-col rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                            <span className="text-xs font-bold text-amber-800">
                                Equipamentos
                            </span>
                            <span className="mt-1 text-2xl font-black text-amber-900">
                                {equipments.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
