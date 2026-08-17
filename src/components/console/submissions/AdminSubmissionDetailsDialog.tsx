"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminSubmissionById } from "@/core/service/adminSubmissionService";
import { SchoolFormSubmission } from "@/schemas/schoolSubmissionSchema";
import { AdminSubmissionActions } from "./AdminSubmissionActions";
import { SubmissionStatusBadge } from "./SubmissionStatusBadge";

interface AdminSubmissionDetailsDialogProps {
    submissionId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmissionUpdated: (submission: SchoolFormSubmission) => void | Promise<void>;
}

interface InfoItemProps {
    label: string;
    value?: React.ReactNode;
}

const formatDate = (value?: string | null) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
};

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {label}
            </p>
            <div className="whitespace-pre-wrap text-sm text-gray-900">{value || "—"}</div>
        </div>
    );
}

function EmptySection({ message }: { message: string }) {
    return (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
            {message}
        </div>
    );
}

export function AdminSubmissionDetailsDialog({
    submissionId,
    open,
    onOpenChange,
    onSubmissionUpdated,
}: AdminSubmissionDetailsDialogProps) {
    const { data, error, isLoading, mutate } = useSWR(
        open && submissionId ? ["admin-submission-detail", submissionId] : null,
        ([, currentSubmissionId]) => getAdminSubmissionById(currentSubmissionId)
    );

    useEffect(() => {
        if (error) toast.error("Não foi possível carregar os detalhes da submissão.");
    }, [error]);

    const handleSubmissionUpdated = async (submission: SchoolFormSubmission) => {
        await mutate(submission, { revalidate: false });
        await onSubmissionUpdated(submission);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-6xl">
                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle>{data?.data.school.name || "Detalhes da submissão"}</DialogTitle>
                    <DialogDescription>
                        Visualização completa e somente leitura dos dados enviados pela escola.
                    </DialogDescription>
                    {data?.status === "PENDENTE" ? (
                        <AdminSubmissionActions
                            submission={data}
                            onSubmissionUpdated={handleSubmissionUpdated}
                        />
                    ) : null}
                </DialogHeader>

                <div className="overflow-y-auto px-6 pb-6">
                    {isLoading ? (
                        <div className="flex min-h-72 items-center justify-center gap-2 text-sm text-gray-500">
                            <LoaderCircle className="animate-spin" size={18} />
                            Carregando detalhes...
                        </div>
                    ) : error ? (
                        <div className="flex min-h-72 items-center justify-center text-sm text-red-600">
                            Não foi possível carregar os detalhes da submissão.
                        </div>
                    ) : data ? (
                        <Tabs defaultValue="overview" className="pt-5">
                            <div className="overflow-x-auto pb-2">
                                <TabsList className="h-auto min-w-max">
                                    <TabsTrigger
                                        value="overview"
                                        className="text-gray-800 data-[state=active]:text-gray-950 in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white! in-data-[theme=dark]:data-[state=active]:bg-primary in-data-[theme=dark]:data-[state=active]:text-white!">
                                        Visão Geral
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="school"
                                        className="text-gray-800 data-[state=active]:text-gray-950 in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white! in-data-[theme=dark]:data-[state=active]:bg-primary in-data-[theme=dark]:data-[state=active]:text-white!">
                                        Escola
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="clubs"
                                        className="text-gray-800 data-[state=active]:text-gray-950 in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white! in-data-[theme=dark]:data-[state=active]:bg-primary in-data-[theme=dark]:data-[state=active]:text-white!">
                                        Clubes
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="projects"
                                        className="text-gray-800 data-[state=active]:text-gray-950 in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white! in-data-[theme=dark]:data-[state=active]:bg-primary in-data-[theme=dark]:data-[state=active]:text-white!">
                                        Projetos
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="researchers"
                                        className="text-gray-800 data-[state=active]:text-gray-950 in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white! in-data-[theme=dark]:data-[state=active]:bg-primary in-data-[theme=dark]:data-[state=active]:text-white!">
                                        Pesquisadores
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="equipments"
                                        className="text-gray-800 data-[state=active]:text-gray-950 in-data-[theme=dark]:bg-gray-200 in-data-[theme=dark]:text-gray-900 in-data-[theme=dark]:hover:bg-primary/70 in-data-[theme=dark]:hover:text-white! in-data-[theme=dark]:data-[state=active]:bg-primary in-data-[theme=dark]:data-[state=active]:text-white!">
                                        Equipamentos
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="overview" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informações da submissão</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                        <InfoItem
                                            label="Status"
                                            value={<SubmissionStatusBadge status={data.status} />}
                                        />
                                        <InfoItem label="Versão" value={data.version} />
                                        <InfoItem label="Criada em" value={formatDate(data.created_at)} />
                                        <InfoItem
                                            label="Última atualização"
                                            value={formatDate(data.updated_at)}
                                        />
                                        <InfoItem
                                            label="Data-base"
                                            value={formatDate(data.base_timestamp)}
                                        />
                                        <InfoItem
                                            label="Prazo específico"
                                            value={formatDate(data.custom_deadline)}
                                        />
                                        <InfoItem
                                            label="Conflito detectado"
                                            value={data.has_conflict ? "Sim" : "Não"}
                                        />
                                        <InfoItem
                                            label="Status da prorrogação"
                                            value={data.extension_status}
                                        />
                                    </CardContent>
                                </Card>

                                {data.rejection_reason ? (
                                    <Card className="border-red-200 bg-red-50/50">
                                        <CardHeader>
                                            <CardTitle className="text-red-700">
                                                Motivo da rejeição
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-red-800">
                                            {data.rejection_reason}
                                        </CardContent>
                                    </Card>
                                ) : null}

                                {data.extension_requested_at || data.extension_reason ? (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Solicitação de prorrogação</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid gap-5 sm:grid-cols-2">
                                            <InfoItem
                                                label="Solicitada em"
                                                value={formatDate(data.extension_requested_at)}
                                            />
                                            <InfoItem
                                                label="Prazo solicitado"
                                                value={formatDate(data.requested_deadline)}
                                            />
                                            <div className="sm:col-span-2">
                                                <InfoItem
                                                    label="Justificativa"
                                                    value={data.extension_reason}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : null}
                            </TabsContent>

                            <TabsContent value="school">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Dados da escola</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-5 sm:grid-cols-2">
                                        <InfoItem label="Nome" value={data.data.school.name} />
                                        <InfoItem label="Cidade" value={data.data.school.city} />
                                        <InfoItem label="CEP" value={data.data.school.cep} />
                                        <InfoItem
                                            label="Instagram"
                                            value={data.data.school.instagram_url}
                                        />
                                        <div className="sm:col-span-2">
                                            <InfoItem
                                                label="Descrição"
                                                value={data.data.school.description}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="clubs" className="space-y-3">
                                {data.data.clubs.length ? (
                                    data.data.clubs.map((club) => (
                                        <Card key={club.id}>
                                            <CardContent className="grid gap-4 pt-1 sm:grid-cols-2">
                                                <InfoItem label="Nome" value={club.name} />
                                                <InfoItem
                                                    label="Instagram"
                                                    value={club.instagram_url}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <EmptySection message="Nenhum clube informado." />
                                )}
                            </TabsContent>

                            <TabsContent value="projects" className="space-y-3">
                                {data.data.projects.length ? (
                                    data.data.projects.map((project) => {
                                        const club = data.data.clubs.find(
                                            (item) => item.id === project.clube_ciencia_id
                                        );
                                        return (
                                            <Card key={project.id}>
                                                <CardContent className="grid gap-4 pt-1 sm:grid-cols-2">
                                                    <InfoItem label="Nome" value={project.name} />
                                                    <InfoItem label="Ano" value={project.year} />
                                                    <InfoItem
                                                        label="Clube vinculado"
                                                        value={club?.name}
                                                    />
                                                    <div className="sm:col-span-2">
                                                        <InfoItem
                                                            label="Descrição"
                                                            value={project.description}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <EmptySection message="Nenhum projeto informado." />
                                )}
                            </TabsContent>

                            <TabsContent value="researchers" className="space-y-3">
                                {data.data.researchers.length ? (
                                    data.data.researchers.map((researcher) => {
                                        const projectNames = data.data.projects
                                            .filter((project) =>
                                                researcher.project_ids.includes(project.id)
                                            )
                                            .map((project) => project.name)
                                            .join(", ");
                                        return (
                                            <Card key={researcher.id}>
                                                <CardContent className="grid gap-4 pt-1 sm:grid-cols-2 lg:grid-cols-3">
                                                    <InfoItem label="Nome" value={researcher.name} />
                                                    <InfoItem label="Função" value={researcher.type} />
                                                    <InfoItem label="Gênero" value={researcher.gender} />
                                                    <InfoItem label="Raça/Etnia" value={researcher.race} />
                                                    <InfoItem
                                                        label="ID Lattes"
                                                        value={researcher.lattes_id}
                                                    />
                                                    <InfoItem
                                                        label="Projetos vinculados"
                                                        value={projectNames}
                                                    />
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <EmptySection message="Nenhum pesquisador informado." />
                                )}
                            </TabsContent>

                            <TabsContent value="equipments" className="space-y-3">
                                {data.data.equipments.length ? (
                                    data.data.equipments.map((equipment) => (
                                        <Card key={equipment.id}>
                                            <CardContent className="grid gap-4 pt-1 sm:grid-cols-2">
                                                <InfoItem label="Nome" value={equipment.name} />
                                                <InfoItem
                                                    label="Quantidade"
                                                    value={equipment.quantity}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <EmptySection message="Nenhum equipamento informado." />
                                )}
                            </TabsContent>
                        </Tabs>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
