"use client";

import { useState } from "react";
import {
    Save,
    Send,
    RotateCcw,
    Loader2,
    ClipboardCheck,
    CheckCircle2,
} from "lucide-react";
import { useSchoolSubmission } from "@/hooks/useSchoolSubmission";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { SchoolConsoleHeader } from "@/components/school-console/SchoolConsoleHeader";
import { SchoolImageDropzone } from "@/components/school-console/SchoolImageDropzone";
import { SchoolMainFields } from "@/components/school-console/SchoolMainFields";
import {
    SchoolSubEntitiesTabs,
    TabType,
} from "@/components/school-console/SchoolSubEntitiesTabs";

import { SchoolSidebar, SchoolSection } from "@/components/school-console/SchoolSidebar";
import { SchoolGeneralInfoSection } from "@/components/school-console/SchoolGeneralInfoSection";
import { SchoolFormOverviewSection } from "@/components/school-console/SchoolFormOverviewSection";
import { SchoolHistorySection } from "@/components/school-console/SchoolHistorySection";
import { SchoolFormPreview } from "@/components/school-console/SchoolFormPreview";
import { ClubSitePreview } from "@/components/school-console/ClubSitePreview";
import { SchoolFormDataInput } from "@/schemas/schoolSubmissionSchema";

type PreviewState = {
    mode: "preview" | "review";
    data: SchoolFormDataInput;
};

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
    const [preview, setPreview] = useState<PreviewState | null>(null);
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState<boolean>(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState<boolean>(false);

    const isReadOnly =
        submission?.status === "PENDENTE" || submission?.status === "APROVADO";

    const openReview = () => {
        setPreview({ mode: "review", data: structuredClone(form.getValues()) });
    };

    const handleFormSubmit = async () => {
        const success = await submitForm();
        if (success) {
            setPreview(null);
            setIsSuccessDialogOpen(true);
        }
    };

    const visiblePreview = isReadOnly ? null : preview;

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-[#088077]" size={36} />
                <p className="text-sm font-medium text-gray-500">
                    Carregando formulário da escola...
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Sidebar com estilo idêntico ao da Página Inicial/Console */}
            <SchoolSidebar
                activeSection={activeSection}
                onSelectSection={(sec) => {
                    setPreview(null);
                    setActiveSection(sec);
                }}
            />

            {/* Container Padrão ictite com Borda Profunda e Header */}
            <div className="bg-foreground flex min-h-screen w-full min-w-0 flex-1 flex-col pb-4 pr-4">
                <Header />

                {/* Conteúdo Principal do Console com Inset Box-Shadow de Profundidade */}
                <main
                    className="bg-background flex h-full w-full flex-col gap-6 p-4 sm:p-6"
                    style={{
                        boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, .5)",
                        borderRadius: "10px 10px 10px 10px",
                    }}>
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
                    <div className="border-border bg-card shadow-xs flex min-h-[480px] flex-col gap-6 rounded-2xl border p-6">
                        {visiblePreview ? (
                            <SchoolFormPreview
                                data={visiblePreview.data}
                                mode={visiblePreview.mode}
                                isSubmitting={isSubmitting}
                                onBack={() => setPreview(null)}
                                onSubmit={handleFormSubmit}
                            />
                        ) : (
                            <>
                                {/* 1. ABA GERAL (Informações Gerais e Estatísticas da Escola) */}
                                {activeSection === "geral" && (
                                    <div className="animate-fade-in w-full">
                                        <SchoolGeneralInfoSection
                                            form={form}
                                            submission={submission}
                                        />
                                    </div>
                                )}

                                {/* 2. ABA HISTÓRICO (Linha do Tempo de Atividades da Escola) */}
                                {activeSection === "historico" && (
                                    <div className="animate-fade-in w-full">
                                        <SchoolHistorySection />
                                    </div>
                                )}

                                {/* 3. ABA PRÉVIA DO PORTAL (Visualização como ficará no site público) */}
                                {activeSection === "previa_site" && (
                                    <div className="animate-fade-in w-full">
                                        <ClubSitePreview data={form.getValues()} />
                                    </div>
                                )}

                                {/* 4. ABA VISÃO GERAL (DO FORMULÁRIO: Status do Rascunho e Validações) */}
                                {activeSection === "visao_geral_form" && (
                                    <div className="animate-fade-in w-full">
                                        <SchoolFormOverviewSection
                                            form={form}
                                            submission={submission}
                                            onOpenReview={
                                                isReadOnly ? undefined : openReview
                                            }
                                        />
                                    </div>
                                )}

                                {/* 5. ABA ESCOLA: Exibe Apenas Imagem e Dados da Escola */}
                                {activeSection === "escola" && (
                                    <div className="animate-fade-in flex w-full flex-col gap-6">
                                        <SchoolImageDropzone readOnly={isReadOnly} />
                                        <SchoolMainFields
                                            form={form}
                                            readOnly={isReadOnly}
                                        />
                                    </div>
                                )}

                                {/* 6. ABAS FILHAS DO FORMULÁRIO (CLUBES, PROJETOS, PESQUISADORES, EQUIPAMENTOS) */}
                                {activeSection !== "escola" &&
                                    activeSection !== "visao_geral_form" &&
                                    activeSection !== "geral" &&
                                    activeSection !== "historico" &&
                                    activeSection !== "previa_site" && (
                                        <div className="animate-fade-in w-full">
                                            <SchoolSubEntitiesTabs
                                                form={form}
                                                readOnly={isReadOnly}
                                                activeTab={activeSection as TabType}
                                                ensureDraftSaved={() =>
                                                    saveDraft({ quietSuccess: true })
                                                }
                                                draftData={submission?.data}
                                            />
                                        </div>
                                    )}

                                {/* Barra Inferior de Ações (Preserva o Estado Global do Form) */}
                                {activeSection !== "geral" &&
                                    activeSection !== "historico" &&
                                    activeSection !== "previa_site" &&
                                    (!isReadOnly ||
                                        submission?.status === "APROVADO") && (
                                        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {!isReadOnly && (
                                                    <button
                                                        type="button"
                                                        onClick={() => void saveDraft()}
                                                        disabled={isSaving || isSubmitting}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-gray-800 disabled:opacity-50">
                                                        {isSaving ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Save size={16} />
                                                        )}
                                                        Salvar Rascunho
                                                    </button>
                                                )}

                                                {!isReadOnly && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setIsDiscardDialogOpen(true)
                                                        }
                                                        disabled={isSaving || isSubmitting}
                                                        className="text-font-primary inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold transition-all hover:bg-muted disabled:opacity-50">
                                                        <RotateCcw size={16} />
                                                        Descartar Alterações
                                                    </button>
                                                )}

                                                {(submission?.status === "REJEITADO" ||
                                                    submission?.status === "APROVADO") && (
                                                    <button
                                                        type="button"
                                                        onClick={reopenDraft}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800 transition-all hover:bg-amber-100">
                                                        <RotateCcw size={16} />
                                                        Reabrir Formulário
                                                    </button>
                                                )}
                                            </div>

                                            {!isReadOnly && (submission?.status === "RASCUNHO" ? (
                                                <button
                                                    type="button"
                                                    onClick={openReview}
                                                    disabled={isSaving || isSubmitting}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[#088077] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#088077]/90 disabled:opacity-50">
                                                    <ClipboardCheck size={16} />
                                                    Revisar e enviar
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleFormSubmit}
                                                    disabled={isSaving || isSubmitting}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[#088077] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#088077]/90 disabled:opacity-50">
                                                    {isSubmitting ? (
                                                        <Loader2
                                                            size={16}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Send size={16} />
                                                    )}
                                                    Enviar para Aprovação
                                                </button>
                                            ))}
                                        </div>
                                    )}
                            </>
                        )}
                    </div>
                </main>
                <Footer />
            </div>

            {/* Modal de Confirmação para Descartar Alterações */}
            <Dialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-font-primary text-lg font-semibold">
                            Descartar alterações?
                        </DialogTitle>
                        <DialogDescription className="text-font-secondary mt-1 text-sm">
                            Tem certeza de que deseja descartar as alterações não salvas?
                            Todas as mudanças feitas nesta sessão serão perdidas.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsDiscardDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={async () => {
                                setIsDiscardDialogOpen(false);
                                await refreshFromDatabase();
                            }}>
                            Sim, descartar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Sucesso após Envio do Formulário */}
            <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-[#088077]">
                            <CheckCircle2 size={36} />
                        </div>
                        <DialogHeader className="text-center sm:text-center">
                            <DialogTitle className="text-font-primary text-xl font-bold uppercase tracking-tight">
                                Formulário Enviado com Sucesso!
                            </DialogTitle>
                            <DialogDescription className="text-font-primary mt-3 text-sm font-semibold leading-relaxed">
                                VOCÊ ACABA DE ENVIAR/ATUALIZAR AS INFORMAÇÕES DO SEU(S)
                                CLUBE(S) DE CIÊNCIAS PARA O PORTAL DA REDE ICTITE.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            type="button"
                            className="bg-[#088077] px-8 text-white hover:bg-[#088077]/90"
                            onClick={() => setIsSuccessDialogOpen(false)}>
                            Entendido
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
