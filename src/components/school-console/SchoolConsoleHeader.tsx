"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, AlertTriangle, CheckCircle2, XCircle, FileText } from "lucide-react";
import { SchoolFormSubmission, RequestDeadlineExtension } from "@/schemas/schoolSubmissionSchema";
import { RequestExtensionModal } from "./modals/RequestExtensionModal";

interface SchoolConsoleHeaderProps {
    submission: SchoolFormSubmission | null;
    globalDeadline: string | null | undefined;
    onRequestExtension: (payload: RequestDeadlineExtension) => Promise<boolean>;
}

export function SchoolConsoleHeader({
    submission,
    globalDeadline,
    onRequestExtension,
}: SchoolConsoleHeaderProps) {
    const [isExtensionModalOpen, setIsExtensionModalOpen] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const updateTime = () => setCurrentTime(Date.now());
        const initialTimer = window.setTimeout(updateTime, 0);
        const interval = window.setInterval(updateTime, 60_000);
        return () => {
            window.clearTimeout(initialTimer);
            window.clearInterval(interval);
        };
    }, []);

    const effectiveDeadline = submission?.custom_deadline ?? globalDeadline;
    const hasExpiredWithoutRequest = Boolean(
        submission &&
        submission.status !== "PENDENTE" &&
        submission.status !== "APROVADO" &&
        !submission.extension_requested_at &&
        !submission.extension_status &&
        effectiveDeadline &&
        currentTime > new Date(effectiveDeadline).getTime()
    );

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "RASCUNHO":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                        <FileText size={14} /> RASCUNHO (Edição aberta)
                    </span>
                );
            case "PENDENTE":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
                        <Clock size={14} /> PENDENTE (Aguardando Aprovação)
                    </span>
                );
            case "REJEITADO":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 border border-red-200">
                        <XCircle size={14} /> REJEITADO (Necessita Correção)
                    </span>
                );
            case "APROVADO":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={14} /> APROVADO
                    </span>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-font-primary text-2xl font-bold">Console da Escola</h1>
                    {getStatusBadge(submission?.status)}
                </div>

                {!hasExpiredWithoutRequest && <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsExtensionModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#088077]/30 bg-[#088077]/10 px-4 py-2 text-xs font-medium text-[#088077] hover:bg-[#088077]/20 transition-all shadow-sm"
                    >
                        <Clock size={15} />
                        Solicitar Prorrogação
                    </button>
                </div>}
            </div>

            {hasExpiredWithoutRequest && (
                <div role="alert" className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" size={20} />
                        <div className="text-font-primary text-sm">
                            <strong className="block font-semibold">O prazo de envio do formulário terminou.</strong>
                            <p>Você pode solicitar um novo prazo para enviar o formulário.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsExtensionModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                    >
                        <Clock size={16} />
                        Solicitar novo prazo
                    </button>
                </div>
            )}

            {/* Banner de Rejeição ou Alerta de Prazo */}
            {submission?.status === "REJEITADO" && submission.rejection_reason && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm">
                    <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={20} />
                    <div className="flex-1 text-sm">
                        <strong className="font-semibold block mb-1">Motivo do Indeferimento:</strong>
                        <p className="text-red-800">{submission.rejection_reason}</p>
                    </div>
                </div>
            )}

            {/* Informações de Prazo Limite & Status da Solicitacao */}
            {(submission?.custom_deadline || submission?.extension_status) && (
                <div className="bg-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4 text-xs shadow-sm">
                    {submission.custom_deadline && (
                        <div className="text-font-primary flex items-center gap-2">
                            <Calendar size={16} className="text-[#088077]" />
                            <span>
                                <strong>Prazo Estendido Concedido:</strong> {formatDate(submission.custom_deadline)}
                            </span>
                        </div>
                    )}

                    {submission.extension_status && (
                        <div className="flex items-center gap-2">
                            <span className="text-font-secondary font-medium">Status da Prorrogação:</span>
                            <span className={`font-semibold px-2.5 py-0.5 rounded-full ${
                                submission.extension_status === "Pendente"
                                    ? "bg-amber-100 text-amber-800"
                                    : submission.extension_status === "Aprovado"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                            }`}>
                                {submission.extension_status}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <RequestExtensionModal
                isOpen={isExtensionModalOpen}
                onClose={() => setIsExtensionModalOpen(false)}
                onSubmit={onRequestExtension}
            />
        </div>
    );
}
