"use client";

import { useState } from "react";
import { Save, RefreshCw, Send, RotateCcw, Loader2 } from "lucide-react";
import { useSchoolSubmission } from "@/hooks/useSchoolSubmission";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

import { SchoolConsoleHeader } from "@/components/school-console/SchoolConsoleHeader";
import { SchoolImageDropzone } from "@/components/school-console/SchoolImageDropzone";
import { SchoolMainFields } from "@/components/school-console/SchoolMainFields";
import { SchoolSubEntitiesTabs, TabType } from "@/components/school-console/SchoolSubEntitiesTabs";
import { SchoolSidebar, SchoolSection } from "@/components/school-console/SchoolSidebar";
import { SchoolGeneralInfoSection } from "@/components/school-console/SchoolGeneralInfoSection";
import { SchoolFormOverviewSection } from "@/components/school-console/SchoolFormOverviewSection";

export default function SchoolConsolePage() {
    const {
        submission,
        isLoading,
        isSaving,
        isSubmitting,
        form,
        saveDraft,
        submitForm,
        refreshFromDatabase,
        reopenDraft,
        requestDeadlineExtension,
    } = useSchoolSubmission();

    const [activeSection, setActiveSection] = useState<SchoolSection>("geral");

    const isReadOnly = submission?.status === "PENDENTE" || submission?.status === "APROVADO";

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-[#088077]" size={36} />
                <p className="text-sm font-medium text-gray-500">Carregando formulário da escola...</p>
            </div>
        );
    }

    return (
        <>
            {/* Sidebar com estilo idêntico ao da Página Inicial/Console */}
            <SchoolSidebar
                activeSection={activeSection}
                onSelectSection={(sec) => setActiveSection(sec)}
            />

            {/* Container Padrão ictite com Borda Profunda e Header */}
            <div className="bg-foreground flex w-full flex-col pr-4 pb-4 min-h-screen">
                <Header />

                {/* Conteúdo Principal do Console com Inset Box-Shadow de Profundidade */}
                <main
                    className="bg-background flex h-full w-full flex-col p-4 sm:p-6 gap-6"
                    style={{
                        boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, .5)",
                        borderRadius: "10px 10px 10px 10px",
                    }}
                >
                    {/* Botão de Retrair/Expandir Sidebar & Toaster */}
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                        <span className="text-xs font-semibold text-gray-500">Menu</span>
                    </div>
                    <Toaster />

                    {/* Header do Formulário com Status e Solicitação de Prorrogação */}
                    <SchoolConsoleHeader
                        submission={submission}
                        onRequestExtension={requestDeadlineExtension}
                    />

                    {/* Conteúdo do Módulo Selecionado */}
                    <div className="flex flex-col gap-6 rounded-2xl border border-gray-200/80 bg-[#F9FAFB] p-6 shadow-xs min-h-[480px]">
                        {/* 1. ABA GERAL (Informações Gerais e Estatísticas da Escola) */}
                        {activeSection === "geral" && (
                            <div className="animate-fade-in w-full">
                                <SchoolGeneralInfoSection form={form} submission={submission} />
                            </div>
                        )}

                        {/* 2. ABA VISÃO GERAL (DO FORMULÁRIO: Status do Rascunho e Validações) */}
                        {activeSection === "visao_geral_form" && (
                            <div className="animate-fade-in w-full">
                                <SchoolFormOverviewSection form={form} submission={submission} />
                            </div>
                        )}

                        {/* 3. ABA ESCOLA: Exibe Apenas Imagem e Dados da Escola */}
                        {activeSection === "escola" && (
                            <div className="flex flex-col gap-6 animate-fade-in w-full">
                                <SchoolImageDropzone />
                                <SchoolMainFields form={form} readOnly={isReadOnly} />
                            </div>
                        )}

                        {/* 4. ABAS FILHAS DO FORMULÁRIO (CLUBES, PROJETOS, PESQUISADORES, EQUIPAMENTOS) */}
                        {activeSection !== "escola" &&
                            activeSection !== "visao_geral_form" &&
                            activeSection !== "geral" && (
                                <div className="animate-fade-in w-full">
                                    <SchoolSubEntitiesTabs
                                        form={form}
                                        readOnly={isReadOnly}
                                        activeTab={activeSection as TabType}
                                    />
                                </div>
                            )}

                        {/* Barra Inferior de Ações (Preserva o Estado Global do Form) */}
                        {activeSection !== "geral" && !isReadOnly && (
                            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={saveDraft}
                                        disabled={isSaving || isSubmitting}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-all shadow-xs disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Salvar Rascunho
                                    </button>

                                    <button
                                        type="button"
                                        onClick={refreshFromDatabase}
                                        disabled={isSaving || isSubmitting}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                                    >
                                        <RefreshCw size={16} />
                                        Recarregar do Banco
                                    </button>

                                    {submission?.status === "REJEITADO" && (
                                        <button
                                            type="button"
                                            onClick={reopenDraft}
                                            className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-all"
                                        >
                                            <RotateCcw size={16} />
                                            Reabrir Formulário
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={submitForm}
                                    disabled={isSaving || isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#088077] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#088077]/90 transition-all shadow-sm disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    Enviar para Aprovação
                                </button>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
