"use client";

import { UseFormReturn } from "react-hook-form";
import {
    School,
    MapPin,
    Building2,
    Calendar,
    Handshake,
    SquareChartGantt,
    Book,
    Printer,
    BadgeCheck,
    Instagram,
    FileText,
} from "lucide-react";
import {
    SchoolFormDataInput,
    SchoolFormSubmission,
} from "@/schemas/schoolSubmissionSchema";

interface SchoolGeneralInfoSectionProps {
    form: UseFormReturn<SchoolFormDataInput>;
    submission: SchoolFormSubmission | null;
}

export function SchoolGeneralInfoSection({
    form,
    submission,
}: SchoolGeneralInfoSectionProps) {
    const values = form.watch();
    const schoolName = values.school?.name || "Escola não nomeada";
    const city = values.school?.city || "Bahia";
    const cep = values.school?.cep || "Não informado";
    const rawInstagram = values.school?.instagram_url;
    const description = values.school?.description;

    const formattedInstagramUrl = (() => {
        const value = rawInstagram?.trim();
        if (!value) return null;
        if (/^https?:\/\//i.test(value)) return value;
        const handle = value
            .replace(/^(www\.)?instagram\.com\//i, "")
            .replace(/^@/, "");
        return `https://www.instagram.com/${handle}`;
    })();

    const clubsCount = values.clubs?.length || 0;
    const projectsCount = values.projects?.length || 0;
    const researchersCount = values.researchers?.length || 0;
    const equipmentsCount =
        values.equipments?.reduce((acc, e) => acc + (e.quantity || 1), 0) || 0;

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="animate-fade-in flex w-full flex-col gap-6">
            {/* Header Hero Institucional da Escola */}
            <div className="bg-card flex flex-col gap-6 rounded-3xl border border-border p-8 shadow-sm">
                <div className="flex flex-col items-start gap-6 border-b border-border pb-6 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#088077]/10 text-[#088077]">
                        <School size={40} />
                    </div>

                    <div className="flex flex-1 flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-teal-100 px-3 py-0.5 text-xs font-bold text-teal-800">
                                REDE PÚBLICA DE ENSINO
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <BadgeCheck size={14} /> Ativa no Observatório
                            </span>
                        </div>
                        <h2 className="text-font-primary text-2xl font-black">
                            {schoolName}
                        </h2>
                        <div className="text-font-secondary mt-1 flex flex-wrap items-center gap-4 text-xs font-medium">
                            <span className="flex items-center gap-1">
                                <MapPin size={14} className="text-[#088077]" /> {city}
                            </span>
                            <span className="flex items-center gap-1">
                                <Building2 size={14} className="text-[#088077]" /> CEP:{" "}
                                {cep}
                            </span>
                            {formattedInstagramUrl && (
                                <a
                                    href={formattedInstagramUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 font-semibold text-[#088077] hover:underline">
                                    <Instagram size={14} /> Instagram
                                </a>
                            )}
                            <span className="flex items-center gap-1">
                                <Calendar size={14} className="text-[#088077]" />{" "}
                                Atualizado em: {formatDate(submission?.updated_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Descrição da Instituição */}
                {description && (
                    <div className="text-font-primary flex items-start gap-3 rounded-2xl border border-border bg-background p-4 text-sm">
                        <FileText size={20} className="mt-0.5 shrink-0 text-[#088077]" />
                        <p className="leading-relaxed">{description}</p>
                    </div>
                )}

                {/* Estatísticas Gerais da Instituição com Tipografia Aprimorada */}
                <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
                    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background p-5 shadow-xs">
                        <div className="flex items-center justify-between text-teal-600">
                            <Handshake size={24} />
                            <span className="text-sm font-bold">Clubes</span>
                        </div>
                        <span className="text-font-primary mt-2 text-3xl font-black">
                            {clubsCount}
                        </span>
                        <span className="text-font-secondary text-xs font-medium">Cadastrados</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background p-5 shadow-xs">
                        <div className="flex items-center justify-between text-blue-600">
                            <SquareChartGantt size={24} />
                            <span className="text-sm font-bold">Projetos</span>
                        </div>
                        <span className="text-font-primary mt-2 text-3xl font-black">
                            {projectsCount}
                        </span>
                        <span className="text-font-secondary text-xs font-medium">Ativos</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background p-5 shadow-xs">
                        <div className="flex items-center justify-between text-purple-600">
                            <Book size={24} />
                            <span className="text-sm font-bold">Pesquisadores</span>
                        </div>
                        <span className="text-font-primary mt-2 text-3xl font-black">
                            {researchersCount}
                        </span>
                        <span className="text-font-secondary text-xs font-medium">Integrantes</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background p-5 shadow-xs">
                        <div className="flex items-center justify-between text-amber-600">
                            <Printer size={24} />
                            <span className="text-sm font-bold">Equipamentos</span>
                        </div>
                        <span className="text-font-primary mt-2 text-3xl font-black">
                            {equipmentsCount}
                        </span>
                        <span className="text-font-secondary text-xs font-medium">Unidades</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
