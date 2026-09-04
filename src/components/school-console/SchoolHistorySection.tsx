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
    Undo2,
} from "lucide-react";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";
import { SchoolFormActivityLog } from "@/schemas/schoolSubmissionSchema";
import { Pagination as PaginationSchema } from "@/schemas/Pagination";
import { Button } from "../ui/button";
import { Pagination } from "../Pagination";

export function SchoolHistorySection() {
    const [page, setPage] = useState<number>(1);
    const pageSize = 10;

    const { data, isLoading, error } = useSWR<PaginationSchema<SchoolFormActivityLog>>(
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
                    label: "Formulário Criado",
                    bg: "bg-blue-100 text-blue-800 border-blue-200",
                    icon: PlusCircle,
                };
            case "SALVOU_RASCUNHO":
            case "ATUALIZOU_RASCUNHO":
                return {
                    label: "Formulário Atualizado",
                    bg: "bg-slate-100 text-slate-800 border-slate-200",
                    icon: FileEdit,
                };
            case "SUBMETEU_SUBMISSAO":
            case "ENVIOU_PARA_APROVACAO":
                return {
                    label: "Enviado para Aprovação",
                    bg: "bg-teal-100 text-teal-800 border-teal-200",
                    icon: Send,
                };
            case "APROVOU_SUBMISSAO":
                return {
                    label: "Formulário Aprovado",
                    bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
                    icon: CheckCircle2,
                };
            case "REJEITOU_SUBMISSAO":
                return {
                    label: "Devolvido para Ajustes",
                    bg: "bg-amber-100 text-amber-800 border-amber-200",
                    icon: XCircle,
                };
            case "REABRIU_RASCUNHO":
                return {
                    label: "Formulário Reaberto",
                    bg: "bg-purple-100 text-purple-800 border-purple-200",
                    icon: RotateCcw,
                };
            case "SOLICITOU_PRORROGACAO":
                return {
                    label: "Solicitação de Prorrogação",
                    bg: "bg-indigo-100 text-indigo-800 border-indigo-200",
                    icon: Calendar,
                };
            case "PRORROGACAO_AVALIADA":
            case "APROVOU_PRORROGACAO":
            case "REJEITOU_PRORROGACAO":
                return {
                    label: "Prorrogação Avaliada",
                    bg: "bg-sky-100 text-sky-800 border-sky-200",
                    icon: Clock,
                };
            case "RECARREGOU_RASCUNHO":
            case "RECARREGOU_PRODUCAO":
                return {
                    label: "Alterações Descartadas",
                    bg: "bg-gray-100 text-gray-800 border-gray-200",
                    icon: Undo2,
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
        <div className="animate-fade-in flex w-full flex-col gap-6">
            {/* Header da Seção */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#088077]/10 p-3 text-[#088077]">
                        <History size={28} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Histórico de Mudanças
                        </h2>
                        <p className="text-xs text-gray-500">
                            Acompanhe o registro de todas as edições, salvamentos e envios
                            efetuados no formulário da sua escola.
                        </p>
                    </div>
                </div>

                {data && (
                    <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
                        {totalItems} registro{totalItems !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Conteúdo Principal */}
            <div className="min-h-[380px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                {isLoading ? (
                    <div className="flex min-h-[300px] items-center justify-center gap-2 text-gray-500">
                        <Loader2 className="animate-spin text-[#088077]" size={24} />
                        <span className="text-sm font-medium">
                            Carregando histórico de mudanças...
                        </span>
                    </div>
                ) : error ? (
                    <div className="py-12 text-center text-xs font-medium text-red-500">
                        Erro ao carregar o histórico de mudanças da escola.
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-12 text-center text-xs text-gray-400">
                        Nenhum registro de alteração encontrado.
                    </div>
                ) : (
                    <div className="relative space-y-6 pl-6 before:absolute before:top-2 before:bottom-2 before:left-3 before:w-0.5 before:bg-gray-200">
                        {logs.map((log) => {
                            const badge = formatActionBadge(log.action);
                            const IconComponent = badge.icon;

                            return (
                                <div key={log.id} className="group relative">
                                    {/* Ponto da Linha do Tempo */}
                                    <div className="absolute top-1 -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#088077] bg-white text-[#088077] shadow-xs transition-transform group-hover:scale-110">
                                        <IconComponent size={12} />
                                    </div>

                                    <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-gray-200 hover:bg-white hover:shadow-xs">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${badge.bg}`}>
                                                    <IconComponent size={13} />
                                                    {badge.label}
                                                </span>
                                            </div>

                                            <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                                                <Clock size={13} />
                                                {formatDate(log.created_at)}
                                            </span>
                                        </div>

                                        {log.details && (
                                            <p className="text-xs leading-relaxed font-medium text-gray-700">
                                                {log.details}
                                            </p>
                                        )}

                                        {log.user_name && (
                                            <div className="flex items-center gap-1 pt-1 text-[11px] font-medium text-gray-500">
                                                <User
                                                    size={12}
                                                    className="text-[#088077]"
                                                />
                                                <span>
                                                    Realizado por:{" "}
                                                    <strong>{log.user_name}</strong>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onLoadMore={setPage}
                />
            </div>
        </div>
    );
}
