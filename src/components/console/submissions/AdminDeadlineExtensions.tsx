"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { CalendarClock, Eye, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
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

export function AdminDeadlineExtensions() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<ExtensionStatus | undefined>();
    const [selectedSubmission, setSelectedSubmission] = useState<SchoolFormSubmission | null>(null);
    const requestParams = useMemo(() => ({ page, size: 20, status }), [page, status]);
    const { data, error, isLoading, mutate } = useSWR(
        ["admin-deadline-extensions", requestParams],
        ([, params]) => getDeadlineExtensionRequests(params),
        { keepPreviousData: true }
    );
    const { data: globalDeadline, error: globalDeadlineError } = useSWR(
        "admin-global-deadline",
        getGlobalDeadline
    );

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

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Prazo global</CardTitle>
                    <CardDescription>
                        Prazo vigente para os formulários escolares: {formatDate(globalDeadline?.school_forms_global_deadline)}
                    </CardDescription>
                </CardHeader>
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
