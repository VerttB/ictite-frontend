"use client";

import { useState } from "react";
import { CalendarCheck2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { grantDeadlineExtension } from "@/core/service/adminSubmissionService";
import { SchoolFormSubmission } from "@/schemas/schoolSubmissionSchema";
import { ExtensionStatusBadge } from "./ExtensionStatusBadge";

interface DeadlineExtensionDetailsDialogProps {
    submission: SchoolFormSubmission | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGranted: (submission: SchoolFormSubmission) => void | Promise<void>;
}

const formatDate = (value?: string | null) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
};

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Não foi possível conceder a prorrogação.";

export function DeadlineExtensionDetailsDialog({
    submission,
    open,
    onOpenChange,
    onGranted,
}: DeadlineExtensionDetailsDialogProps) {
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGrant = async () => {
        if (!submission || isSubmitting || submission.extension_status !== "Pendente") return;

        setIsSubmitting(true);
        try {
            const updatedSubmission = await grantDeadlineExtension(submission.id);
            setConfirmationOpen(false);
            await onGranted(updatedSubmission);
            toast.success("Prorrogação concedida com sucesso.");
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={(nextOpen) => {
                    if (!isSubmitting) onOpenChange(nextOpen);
                }}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Solicitação de prorrogação</DialogTitle>
                        <DialogDescription>
                            Consulte os dados enviados pela escola antes de conceder o novo prazo.
                        </DialogDescription>
                    </DialogHeader>

                    {submission ? (
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">Escola</p>
                                <p className="text-sm">{submission.data.school.name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">Situação</p>
                                <ExtensionStatusBadge status={submission.extension_status!} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">Solicitada em</p>
                                <p className="text-sm">{formatDate(submission.extension_requested_at)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">Prazo atual</p>
                                <p className="text-sm">{formatDate(submission.custom_deadline)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">Prazo solicitado</p>
                                <p className="text-sm">{formatDate(submission.requested_deadline)}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs font-semibold uppercase text-gray-500">Justificativa</p>
                                <p className="whitespace-pre-wrap text-sm">{submission.extension_reason || "—"}</p>
                            </div>
                        </div>
                    ) : null}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Fechar
                        </Button>
                        {submission?.extension_status === "Pendente" ? (
                            <Button type="button" onClick={() => setConfirmationOpen(true)}>
                                <CalendarCheck2 size={16} />
                                Conceder prorrogação
                            </Button>
                        ) : null}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={confirmationOpen}
                onOpenChange={(nextOpen) => {
                    if (!isSubmitting) setConfirmationOpen(nextOpen);
                }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar prorrogação</DialogTitle>
                        <DialogDescription>
                            O novo prazo será {formatDate(submission?.requested_deadline)}. Deseja continuar?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmationOpen(false)}
                            disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="button" onClick={handleGrant} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <LoaderCircle className="animate-spin" size={16} />
                            ) : (
                                <CalendarCheck2 size={16} />
                            )}
                            Confirmar concessão
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
