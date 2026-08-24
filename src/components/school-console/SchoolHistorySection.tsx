"use client";

import { useState } from "react";
import useSWR from "swr";
import {
    History,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    Loader2,
    CheckCircle2,
    XCircle,
    FileEdit,
    Send,
    RotateCcw,
    PlusCircle,
    Calendar,
    RefreshCw,
} from "lucide-react";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";
import { SchoolFormActivityLog } from "@/schemas/schoolSubmissionSchema";
import { Pagination } from "@/schemas/Pagination";

export function SchoolHistorySection() {
    const [page, setPage] = useState<number>(1);
    const pageSize = 10;

    const { data, isLoading, error } = useSWR<Pagination<SchoolFormActivityLog>>(
        ["/submissions/logs", page, pageSize],
        ([, p, s]: [string, number, number]) => schoolSubmissionService.getLogs(p, s)
    );

    const logs = data?.items || [];
    const totalPages = data?.total_pages || 1;
    const totalItems = data?.total || 0;

    const formatActionBadge = (action: string) => {
        switch (action) {
            case "CRIOU_RASCUNHO":
                return {
                    label: "Rascunho Criado",
                    bg: "bg-blue-100 text-blue-800 border-blue-200",
                    icon: PlusCircle,
                };
            case "SALVOU_RASCUNHO":
                return {
                    label: "Rascunho Salvo",
                    bg: "bg-slate-100 text-slate-800 border-slate-200",
                    icon: FileEdit,
                };
            case "SUBMETEU_SUBMISSAO":
                return {
                    label: "Enviado para Aprovação",
                    bg: "bg-teal-100 text-teal-800 border-teal-200",
                    icon: Send,
                };
            case "APROVOU_SUBMISSAO":
                return {
                    label: "Submissão Aprovada",
                    bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
                    icon: CheckCircle2,
                };
            case "REJEITOU_SUBMISSAO":
                return {
                    label: "Submissão Rejeitada",
                    bg: "bg-red-100 text-red-800 border-red-200",
                    icon: XCircle,
                };
            case "REABRIU_RASCUNHO":
                return {
                    label: "Rascunho Reaberto",
                    bg: "bg-amber-100 text-amber-800 border-amber-200",
                    icon: RotateCcw,
                };
            case "SOLICITOU_PRORROGACAO":
                return {
                    label: "Prorrogação Solicitada",
                    bg: "bg-purple-100 text-purple-800 border-purple-200",
                    icon: Calendar,
                };
            case "PRORROGACAO_AVALIADA":
                return {
                    label: "Prorrogação Avaliada",
                    bg: "bg-indigo-100 text-indigo-800 border-indigo-200",
                    icon: Clock,
                };
            case "RECARREGOU_PRODUCAO":
                return {
                    label: "Dados Recarregados",
                    bg: "bg-sky-100 text-sky-800 border-sky-200",
                    icon: RefreshCw,
                };
            default:
                return {
                    label: action.replace(/_/g, " "),
                    bg: "bg-gray-100 text-gray-800 border-gray-200",
                    icon: History,
                };
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("pt-BR", {
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
        <div className="flex w-full flex-col gap-6 animate-fade-in">
            {/* Header da Seção */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#088077]/10 p-3 text-[#088077]">
                        <History size={28} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Histórico de Atividades</h2>
                        <p className="text-xs text-gray-500">
                            Registro completo de alterações, submissões e aprovações da escola
                        </p>
                    </div>
                </div>

                {data && (
                    <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-bold text-teal-800">
                        {totalItems} registro{totalItems !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Conteúdo Principal */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm min-h-[380px]">
                {isLoading ? (
                    <div className="flex min-h-[300px] items-center justify-center gap-2 text-gray-500">
                        <Loader2 className="animate-spin text-[#088077]" size={24} />
                        <span className="text-sm font-medium">Carregando histórico...</span>
                    </div>
                ) : error ? (
                    <div className="py-12 text-center text-xs text-red-500 font-medium">
                        Erro ao carregar o histórico de atividades da escola.
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-12 text-center text-xs text-gray-400">
                        Nenhum registro de atividade encontrado.
                    </div>
                ) : (
                    <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                        {logs.map((log) => {
                            const badge = formatActionBadge(log.action);
                            const IconComponent = badge.icon;

                            return (
                                <div key={log.id} className="relative group">
                                    {/* Ponto da Linha do Tempo */}
                                    <div className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-[#088077] text-[#088077] shadow-xs group-hover:scale-110 transition-transform">
                                        <IconComponent size={12} />
                                    </div>

                                    <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-gray-200 hover:bg-white hover:shadow-xs">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${badge.bg}`}
                                                >
                                                    <IconComponent size={13} />
                                                    {badge.label}
                                                </span>
                                            </div>

                                            <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                <Clock size={13} />
                                                {formatDate(log.created_at)}
                                            </span>
                                        </div>

                                        {log.details && (
                                            <p className="text-xs font-medium text-gray-700 leading-relaxed">
                                                {log.details}
                                            </p>
                                        )}

                                        {log.user_name && (
                                            <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 pt-1">
                                                <User size={12} className="text-[#088077]" />
                                                <span>Realizado por: <strong>{log.user_name}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-medium text-gray-600">
                        <span>
                            Página {page} de {totalPages}
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 transition-all"
                            >
                                <ChevronLeft size={14} /> Anterior
                            </button>
                            <button
                                type="button"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 transition-all"
                            >
                                Próxima <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
