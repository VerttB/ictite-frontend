"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { CalendarClock, Eye, LoaderCircle, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ExtensionStatus,
    getDeadlineExtensionRequests,
    getGlobalDeadline,
    updateGlobalDeadline,
} from "@/core/service/adminSubmissionService";
import { SchoolFormSubmission } from "@/schemas/schoolSubmissionSchema";
import { DeadlineExtensionDetailsDialog } from "./DeadlineExtensionDetailsDialog";
import { ExtensionStatusBadge } from "./ExtensionStatusBadge";

const extensionStatuses: ExtensionStatus[] = ["Pendente", "Aprovado", "Rejeitado"];

const formatDate = (value?: string | null) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
};

const toLocalDateTimeInput = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return localDate.toISOString().slice(0, 16);
};

export function AdminDeadlineExtensions() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<ExtensionStatus | undefined>();
    const [selectedSubmission, setSelectedSubmission] = useState<SchoolFormSubmission | null>(null);
    const [deadlineInput, setDeadlineInput] = useState("");
    const [isSavingDeadline, setIsSavingDeadline] = useState(false);
    const requestParams = useMemo(() => ({ page, size: 20, status }), [page, status]);
    const { data, error, isLoading, mutate } = useSWR(
        ["admin-deadline-extensions", requestParams],
        ([, params]) => getDeadlineExtensionRequests(params),
        { keepPreviousData: true }
    );
    const {
        data: globalDeadline,
        error: globalDeadlineError,
        isLoading: isGlobalDeadlineLoading,
        mutate: mutateGlobalDeadline,
    } = useSWR(
        "admin-global-deadline",
        getGlobalDeadline
    );

    useEffect(() => {
        setDeadlineInput(
            toLocalDateTimeInput(globalDeadline?.school_forms_global_deadline)
        );
    }, [globalDeadline?.school_forms_global_deadline]);

    useEffect(() => {
        if (error) toast.error("Não foi possível carregar as solicitações de prorrogação.");
    }, [error]);

    useEffect(() => {
        if (globalDeadlineError) toast.error("Não foi possível carregar o prazo global.");
    }, [globalDeadlineError]);

    const handleGranted = async (updatedSubmission: SchoolFormSubmission) => {
        await mutate(
            (current) => {
                if (!current) return current;

                const leavesCurrentFilter = status && status !== updatedSubmission.extension_status;
                const items = leavesCurrentFilter
                    ? current.items.filter((item) => item.id !== updatedSubmission.id)
                    : current.items.map((item) =>
                          item.id === updatedSubmission.id ? updatedSubmission : item
                      );
                const total = leavesCurrentFilter ? Math.max(0, current.total - 1) : current.total;

                return {
                    ...current,
                    items,
                    total,
                    total_pages: total === 0 ? 0 : Math.ceil(total / current.size),
                };
            },
            { revalidate: false }
        );
        setSelectedSubmission(updatedSubmission);
    };

    const saveGlobalDeadline = async (value: string | null) => {
        if (value !== null && Number.isNaN(new Date(value).getTime())) {
            toast.error("Informe uma data e hora válidas.");
            return;
        }

        setIsSavingDeadline(true);
        try {
            const updated = await updateGlobalDeadline(
                value === null ? null : new Date(value).toISOString()
            );
            await mutateGlobalDeadline(updated, { revalidate: false });
            toast.success(value === null ? "Prazo global removido." : "Prazo global atualizado.");
        } catch {
            toast.error("Não foi possível atualizar o prazo global.");
        } finally {
            setIsSavingDeadline(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <CalendarClock size={18} />
                        Prazo global
                    </CardTitle>
                    <CardDescription>
                        Data limite aplicada às escolas sem prorrogação individual.
                        Prazo vigente: {formatDate(globalDeadline?.school_forms_global_deadline)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                        <label htmlFor="school-form-global-deadline" className="text-sm font-medium">
                            Nova data e hora limite
                        </label>
                        <Input
                            id="school-form-global-deadline"
                            type="datetime-local"
                            value={deadlineInput}
                            onChange={(event) => setDeadlineInput(event.target.value)}
                            disabled={isGlobalDeadlineLoading || isSavingDeadline}
                        />
                    </div>
                    <Button
                        type="button"
                        onClick={() =>
                            void saveGlobalDeadline(deadlineInput || null)
                        }
                        disabled={
                            isGlobalDeadlineLoading ||
                            isSavingDeadline ||
                            !deadlineInput
                        }>
                        {isSavingDeadline ? (
                            <LoaderCircle className="animate-spin" size={16} />
                        ) : (
                            <Save size={16} />
                        )}
                        Salvar prazo
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void saveGlobalDeadline(null)}
                        disabled={
                            isGlobalDeadlineLoading ||
                            isSavingDeadline ||
                            !globalDeadline?.school_forms_global_deadline
                        }>
                        <Trash2 size={16} />
                        Remover prazo
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <CalendarClock size={20} />
                                Solicitações de prorrogação
                            </CardTitle>
                            <CardDescription>Consulte e conceda prazos solicitados pelas escolas.</CardDescription>
                        </div>
                        <Select
                            value={status ?? "TODOS"}
                            onValueChange={(value) => {
                                setStatus(value === "TODOS" ? undefined : (value as ExtensionStatus));
                                setPage(1);
                            }}>
                            <SelectTrigger className="w-44" aria-label="Filtrar solicitações por situação">
                                <SelectValue placeholder="Todas as situações" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TODOS">Todas as situações</SelectItem>
                                {extensionStatuses.map((item) => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && !data ? (
                        <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
                            <LoaderCircle className="animate-spin" size={18} />
                            Carregando solicitações...
                        </div>
                    ) : error ? (
                        <div className="flex min-h-48 items-center justify-center text-sm text-red-600">
                            Não foi possível carregar as solicitações.
                        </div>
                    ) : data?.items.length ? (
                        <Table className="min-w-[900px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold text-gray-800">Escola</TableHead>
                                    <TableHead className="font-semibold text-gray-800">Situação</TableHead>
                                    <TableHead className="font-semibold text-gray-800">Solicitada em</TableHead>
                                    <TableHead className="font-semibold text-gray-800">Prazo atual</TableHead>
                                    <TableHead className="font-semibold text-gray-800">Prazo solicitado</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-800">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">{submission.data.school.name}</TableCell>
                                        <TableCell>
                                            {submission.extension_status ? (
                                                <ExtensionStatusBadge status={submission.extension_status} />
                                            ) : "—"}
                                        </TableCell>
                                        <TableCell>{formatDate(submission.extension_requested_at)}</TableCell>
                                        <TableCell>{formatDate(submission.custom_deadline)}</TableCell>
                                        <TableCell>{formatDate(submission.requested_deadline)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="in-data-[theme=dark]:border-transparent in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white!"
                                                onClick={() => setSelectedSubmission(submission)}>
                                                <Eye size={16} />
                                                Ver detalhes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex min-h-48 items-center justify-center text-sm text-gray-500">
                            Nenhuma solicitação de prorrogação encontrada.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Pagination
                currentPage={data?.page ?? page}
                onLoadMore={setPage}
                totalPages={data?.total_pages ?? 0}
            />

            <DeadlineExtensionDetailsDialog
                submission={selectedSubmission}
                open={selectedSubmission !== null}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) setSelectedSubmission(null);
                }}
                onGranted={handleGranted}
            />
        </div>
    );
}
