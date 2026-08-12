"use client";

import { UseFormReturn } from "react-hook-form";
import {
    FileText,
    CheckCircle2,
    AlertCircle,
    Handshake,
    SquareChartGantt,
    Book,
    Printer,
    Clock,
} from "lucide-react";
import { SchoolFormDraftData, SchoolFormSubmission } from "@/schemas/schoolSubmissionSchema";

interface SchoolFormOverviewSectionProps {
    form: UseFormReturn<SchoolFormDraftData>;
    submission: SchoolFormSubmission | null;
}

export function SchoolFormOverviewSection({ form, submission }: SchoolFormOverviewSectionProps) {
    const values = form.watch();
    const schoolName = values.school?.name || "Escola não nomeada";

    const clubs = values.clubs || [];
    const projects = values.projects || [];
    const researchers = values.researchers || [];
    const equipments = values.equipments || [];

    // Form Completion Checklist
    const hasSchoolData = !!values.school?.name && values.school.name.trim().length >= 2;
    const hasClubs = clubs.length > 0;
    const hasProjects = projects.length > 0;
    const hasResearchers = researchers.length > 0;
    const isReady = hasSchoolData && hasClubs && hasProjects && hasResearchers;

    const completedSectionsCount = [hasSchoolData, hasClubs, hasProjects, hasResearchers].filter(Boolean).length;
    const completionPercentage = Math.round((completedSectionsCount / 4) * 100);

    return (
        <div className="flex w-full flex-col gap-6 animate-fade-in">
            {/* Header da Visão Geral do Formulário */}
            <div className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#088077]/10 p-3 text-[#088077]">
                        <FileText size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-900">Visão Geral do Formulário</h2>
                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">
                                Versão {submission?.version || 1}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Status do rascunho e validação das informações pré-submissão
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-[#088077]">{completionPercentage}% Concluído</span>
                        <div className="h-2 w-32 rounded-full bg-gray-100 overflow-hidden mt-1">
                            <div
                                className="h-full bg-[#088077] transition-all duration-300"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Checklist de Validação do Formulário */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-[#088077]" />
                        Validação das Seções do Formulário
                    </h3>

                    <div className="space-y-3 text-xs font-semibold">
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 border border-gray-100">
                            <span className="text-gray-700">1. Cadastro da Escola</span>
                            {hasSchoolData ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={15} /> OK ({schoolName})
                                </span>
                            ) : (
                                <span className="text-amber-600 font-bold flex items-center gap-1">
                                    <AlertCircle size={15} /> Pendente
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 border border-gray-100">
                            <span className="text-gray-700">2. Clubes de Ciência</span>
                            {hasClubs ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={15} /> OK ({clubs.length} cadastrado{clubs.length > 1 ? "s" : ""})
                                </span>
                            ) : (
                                <span className="text-amber-600 font-bold flex items-center gap-1">
                                    <AlertCircle size={15} /> Nenhum clube cadastrado
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 border border-gray-100">
                            <span className="text-gray-700">3. Projetos de Pesquisa</span>
                            {hasProjects ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={15} /> OK ({projects.length} projeto{projects.length > 1 ? "s" : ""})
                                </span>
                            ) : (
                                <span className="text-amber-600 font-bold flex items-center gap-1">
                                    <AlertCircle size={15} /> Nenhum projeto cadastrado
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 border border-gray-100">
                            <span className="text-gray-700">4. Pesquisadores</span>
                            {hasResearchers ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={15} /> OK ({researchers.length} pesquisador{researchers.length > 1 ? "es" : ""})
                                </span>
                            ) : (
                                <span className="text-amber-600 font-bold flex items-center gap-1">
                                    <AlertCircle size={15} /> Nenhum pesquisador cadastrado
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resumo de Contagem de Itens no Rascunho */}
                <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Clock size={18} className="text-[#088077]" />
                        Resumo dos Dados no Rascunho
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                            <span className="text-xs font-bold text-teal-800">Clubes de Ciência</span>
                            <span className="text-2xl font-black text-teal-900 mt-1">{clubs.length}</span>
                        </div>

                        <div className="flex flex-col p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                            <span className="text-xs font-bold text-blue-800">Projetos de Pesquisa</span>
                            <span className="text-2xl font-black text-blue-900 mt-1">{projects.length}</span>
                        </div>

                        <div className="flex flex-col p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                            <span className="text-xs font-bold text-purple-800">Pesquisadores</span>
                            <span className="text-2xl font-black text-purple-900 mt-1">{researchers.length}</span>
                        </div>

                        <div className="flex flex-col p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                            <span className="text-xs font-bold text-amber-800">Equipamentos</span>
                            <span className="text-2xl font-black text-amber-900 mt-1">{equipments.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
