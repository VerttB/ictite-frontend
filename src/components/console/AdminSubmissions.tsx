"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { ClipboardList, Eye, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import MenuSuperiorPagina from "@/components/MenuSuperiorPagina";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AdminSubmissionSearchParams,
    getAdminSubmissions,
    SubmissionStatus,
} from "@/core/service/adminSubmissionService";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { AdminSubmissionDetailsDialog } from "@/components/console/submissions/AdminSubmissionDetailsDialog";
import { SubmissionStatusBadge } from "@/components/console/submissions/SubmissionStatusBadge";
import { AdminDeadlineExtensions } from "@/components/console/submissions/AdminDeadlineExtensions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusOptions: SubmissionStatus[] = [
    "RASCUNHO",
    "PENDENTE",
    "REJEITADO",
    "APROVADO",
];

interface AdminSubmissionsProps {
    params: AdminSubmissionSearchParams;
}

const formatDate = (value?: string | null) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
};

export function AdminSubmissions({ params }: AdminSubmissionsProps) {
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
    const { applyFilters, changePage } = useUrlPagination();
    const requestParams = useMemo(
        () => ({ page: params.page ?? 1, size: params.size ?? 20, status: params.status }),
        [params.page, params.size, params.status]
    );
    const { data, error, isLoading, mutate } = useSWR(
        ["admin-submissions", requestParams],
        ([, currentParams]) => getAdminSubmissions(currentParams),
        { keepPreviousData: true }
    );

    useEffect(() => {
        if (error) toast.error("Não foi possível carregar as submissões.");
    }, [error]);

    const handleStatusChange = (value: string) => {
        applyFilters({
            status: value === "TODOS" ? undefined : value,
            size: requestParams.size,
        });
    };

    return (
        <div className="flex w-full flex-col gap-6 py-4 sm:px-8">
            <MenuSuperiorPagina title="Submissões" />

            <Tabs defaultValue="submissions" className="space-y-6">
                <TabsList>
                    <TabsTrigger
                        value="submissions"
                        className="text-gray-800 data-[state=active]:text-gray-950 in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white! in-data-[theme=dark]:data-[state=active]:bg-primary in-data-[theme=dark]:data-[state=active]:text-white!">
                        Submissões
                    </TabsTrigger>
                    <TabsTrigger
                        value="extensions"
                        className="text-gray-800 data-[state=active]:text-gray-950 in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white! in-data-[theme=dark]:data-[state=active]:bg-primary in-data-[theme=dark]:data-[state=active]:text-white!">
                        Prorrogações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="submissions" className="space-y-6">
            <Card>
                <CardHeader className="border-b">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList size={20} />
                                Submissões escolares
                            </CardTitle>
                            <CardDescription>
                                Acompanhe os formulários enviados pelas escolas.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select
                                value={params.status ?? "TODOS"}
                                onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-44" aria-label="Filtrar por status">
                                    <SelectValue placeholder="Todos os status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TODOS">Todos os status</SelectItem>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {params.status ? (
                                <Button
                                    variant="outline"
                                    onClick={() => handleStatusChange("TODOS")}>
                                    Limpar
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {isLoading && !data ? (
                        <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
                            <LoaderCircle className="animate-spin" size={18} />
                            Carregando submissões...
                        </div>
                    ) : error ? (
                        <div className="flex min-h-48 items-center justify-center text-sm text-red-600">
                            Não foi possível carregar as submissões.
                        </div>
                    ) : data?.items.length ? (
                        <Table className="min-w-[900px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold text-gray-800">Escola</TableHead>
                                    <TableHead className="font-semibold text-gray-800">Status</TableHead>
                                    <TableHead className="font-semibold text-gray-800">Versão</TableHead>
                                    <TableHead className="font-semibold text-gray-800">Prazo</TableHead>
                                    <TableHead className="font-semibold text-gray-800">Última atualização</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-800">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">
                                            {submission.data.school.name}
                                        </TableCell>
                                        <TableCell>
                                            <SubmissionStatusBadge status={submission.status} />
                                        </TableCell>
                                        <TableCell>{submission.version}</TableCell>
                                        <TableCell>{formatDate(submission.custom_deadline)}</TableCell>
                                        <TableCell>{formatDate(submission.updated_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="in-data-[theme=dark]:border-transparent in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white!"
                                                onClick={() => setSelectedSubmissionId(submission.id)}>
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
                            Nenhuma submissão encontrada.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Pagination
                currentPage={data?.page ?? requestParams.page}
                onLoadMore={changePage}
                totalPages={data?.total_pages ?? 0}
            />

                </TabsContent>

                <TabsContent value="extensions">
                    <AdminDeadlineExtensions />
                </TabsContent>
            </Tabs>

            <AdminSubmissionDetailsDialog
                submissionId={selectedSubmissionId}
                open={selectedSubmissionId !== null}
                onSubmissionUpdated={(updatedSubmission) => {
                    void mutate(
                        (current) => {
                            if (!current) return current;

                            const leavesCurrentFilter =
                                params.status && params.status !== updatedSubmission.status;
                            const items = leavesCurrentFilter
                                ? current.items.filter(
                                      (submission) => submission.id !== updatedSubmission.id
                                  )
                                : current.items.map((submission) =>
                                      submission.id === updatedSubmission.id
                                          ? updatedSubmission
                                          : submission
                                  );
                            const total = leavesCurrentFilter
                                ? Math.max(0, current.total - 1)
                                : current.total;

                            return {
                                ...current,
                                items,
                                total,
                                total_pages:
                                    total === 0 ? 0 : Math.ceil(total / current.size),
                            };
                        },
                        { revalidate: false }
                    );
                }}
                onOpenChange={(open) => {
                    if (!open) setSelectedSubmissionId(null);
                }}
            />
        </div>
    );
}
