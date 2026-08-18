"use client";

import { UseFormReturn } from "react-hook-form";
import {
    BarChart3,
    Handshake,
    SquareChartGantt,
    Book,
    Printer,
    CheckCircle2,
    AlertCircle,
    School,
    Users,
    GraduationCap,
} from "lucide-react";
import { SchoolFormDraftData } from "@/schemas/schoolSubmissionSchema";

interface SchoolOverviewSectionProps {
    form: UseFormReturn<SchoolFormDraftData>;
}

export function SchoolOverviewSection({ form }: SchoolOverviewSectionProps) {
    const values = form.watch();
    const schoolName = values.school?.name || "Escola não nomeada";

    const clubs = values.clubs || [];
    const projects = values.projects || [];
    const researchers = values.researchers || [];
    const equipments = values.equipments || [];

    const studentsCount = researchers.filter((r) => r.type === "Aluno").length;
    const teachersCount = researchers.filter((r) => r.type === "Professor").length;
    const facilitatorsCount = researchers.filter((r) => r.type === "Facilitador").length;

    const totalEquipmentUnits = equipments.reduce((acc, eq) => acc + (eq.quantity || 1), 0);

    // Checklist Items
    const hasSchoolData = !!values.school?.name && values.school.name.trim().length >= 2;
    const hasClubs = clubs.length > 0;
    const hasProjects = projects.length > 0;
    const hasResearchers = researchers.length > 0;
    const isReadyForSubmission = hasSchoolData && hasClubs && hasProjects && hasResearchers;

    return (
        <div className="flex w-full flex-col gap-8 animate-fade-in">
            {/* Banner de Boas-Vindas & Status de Submissão */}
            <div className="flex w-full flex-wrap items-center justify-between gap-6 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-[#088077]/10 p-4 text-[#088077]">
                        <BarChart3 size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            Painel de Controle Institucional
                        </h2>
                        <p className="text-sm text-gray-500">
                            Acompanhe os dados pré-submissão e o status de prontidão da escola
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isReadyForSubmission ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={18} /> Formulário Completo
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800 border border-amber-200">
                            <AlertCircle size={18} /> Cadastro Em Andamento
                        </span>
                    )}
                </div>
            </div>

            {/* Grid Amplo de Métricas Principais (4 Colunas com preenchimento generoso) */}
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Clubes */}
                <div className="flex items-center justify-between rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:border-[#088077]/40 transition-all">
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-black text-gray-900">{clubs.length}</span>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Clubes de Ciência
                        </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                        <Handshake size={28} />
                    </div>
                </div>

                {/* 2. Projetos */}
                <div className="flex items-center justify-between rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:border-[#088077]/40 transition-all">
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-black text-gray-900">{projects.length}</span>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Projetos de Pesquisa
                        </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <SquareChartGantt size={28} />
                    </div>
                </div>

                {/* 3. Pesquisadores */}
                <div className="flex items-center justify-between rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:border-[#088077]/40 transition-all">
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-black text-gray-900">{researchers.length}</span>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Pesquisadores
                        </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                        <Book size={28} />
                    </div>
                </div>

                {/* 4. Equipamentos */}
                <div className="flex items-center justify-between rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:border-[#088077]/40 transition-all">
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-black text-gray-900">{totalEquipmentUnits}</span>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Equipamentos
                        </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                        <Printer size={28} />
                    </div>
                </div>
            </div>

            {/* Painel Amplo de Detalhamento em 2 Colunas Generosas */}
            <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Coluna 1: Composição do Corpo de Pesquisadores */}
                <div className="flex w-full flex-col gap-5 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <Users size={22} className="text-[#088077]" />
                        Detalhamento do Corpo de Pesquisadores
                    </h3>

                    <div className="flex flex-col gap-3.5 mt-2">
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50/80 p-4 text-sm font-semibold border border-gray-100">
                            <span className="flex items-center gap-3 text-gray-700">
                                <GraduationCap size={20} className="text-blue-500" /> Alunos Participantes
                            </span>
                            <span className="rounded-xl bg-blue-100 px-4 py-1.5 font-bold text-blue-800 text-base">
                                {studentsCount}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-gray-50/80 p-4 text-sm font-semibold border border-gray-100">
                            <span className="flex items-center gap-3 text-gray-700">
                                <School size={20} className="text-emerald-500" /> Professores Orientadores
                            </span>
                            <span className="rounded-xl bg-emerald-100 px-4 py-1.5 font-bold text-emerald-800 text-base">
                                {teachersCount}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-gray-50/80 p-4 text-sm font-semibold border border-gray-100">
                            <span className="flex items-center gap-3 text-gray-700">
                                <Users size={20} className="text-purple-500" /> Facilitadores e Tutores
                            </span>
                            <span className="rounded-xl bg-purple-100 px-4 py-1.5 font-bold text-purple-800 text-base">
                                {facilitatorsCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Coluna 2: Checklist de Validação Pré-Envio */}
                <div className="flex w-full flex-col gap-5 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <CheckCircle2 size={22} className="text-[#088077]" />
                        Checklist de Prontidão para Homologação
                    </h3>

                    <div className="flex flex-col gap-3 mt-2 text-xs font-semibold">
                        <div className="flex items-center justify-between rounded-2xl p-3.5 bg-gray-50/80 border border-gray-100">
                            <span className="text-gray-700 text-sm">Dados Principais da Escola</span>
                            {hasSchoolData ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    <CheckCircle2 size={16} /> Preenchido ({schoolName})
                                </span>
                            ) : (
                                <span className="text-amber-600 font-bold flex items-center gap-1.5 text-xs bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                    <AlertCircle size={16} /> Nome da escola pendente
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between rounded-2xl p-3.5 bg-gray-50/80 border border-gray-100">
                            <span className="text-gray-700 text-sm">Ao menos 1 Clube de Ciência</span>
                            {hasClubs ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    <CheckCircle2 size={16} /> OK ({clubs.length} clube{clubs.length > 1 ? "s" : ""})
                                </span>
                            ) : (
                                <span className="text-amber-600 font-bold flex items-center gap-1.5 text-xs bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                    <AlertCircle size={16} /> Nenhum clube cadastrado
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between rounded-2xl p-3.5 bg-gray-50/80 border border-gray-100">
                            <span className="text-gray-700 text-sm">Ao menos 1 Projeto de Pesquisa</span>
                            {hasProjects ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    <CheckCircle2 size={16} /> OK ({projects.length} projeto{projects.length > 1 ? "s" : ""})
                                </span>
                            ) : (
                                <span className="text-amber-600 font-bold flex items-center gap-1.5 text-xs bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                    <AlertCircle size={16} /> Nenhum projeto cadastrado
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between rounded-2xl p-3.5 bg-gray-50/80 border border-gray-100">
                            <span className="text-gray-700 text-sm">Corpo de Pesquisadores Registrado</span>
                            {hasResearchers ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    <CheckCircle2 size={16} /> OK ({researchers.length} integrante{researchers.length > 1 ? "s" : ""})
                                </span>
                            ) : (
                                <span className="text-amber-600 font-bold flex items-center gap-1.5 text-xs bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                    <AlertCircle size={16} /> Nenhum pesquisador cadastrado
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
