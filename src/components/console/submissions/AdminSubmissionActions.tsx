"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
    approveAdminSubmission,
    rejectAdminSubmission,
} from "@/core/service/adminSubmissionService";
import { SchoolFormSubmission } from "@/schemas/schoolSubmissionSchema";

interface AdminSubmissionActionsProps {
    submission: SchoolFormSubmission;
    onSubmissionUpdated: (submission: SchoolFormSubmission) => void | Promise<void>;
}

type PendingAction = "approve" | "reject" | null;

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Não foi possível concluir a ação.";

export function AdminSubmissionActions({
    submission,
    onSubmissionUpdated,
}: AdminSubmissionActionsProps) {
    const [approvalOpen, setApprovalOpen] = useState(false);
    const [rejectionOpen, setRejectionOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejectionError, setRejectionError] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const isSubmitting = pendingAction !== null;

    const handleApprove = async () => {
        if (isSubmitting || submission.status !== "PENDENTE") return;

        setPendingAction("approve");
        try {
            const updatedSubmission = await approveAdminSubmission(submission.id);
            setApprovalOpen(false);
            await onSubmissionUpdated(updatedSubmission);
            toast.success("Submissão aprovada com sucesso.");
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setPendingAction(null);
        }
    };

    const handleReject = async () => {
        const reason = rejectionReason.trim();
        if (!reason) {
            setRejectionError("Informe o motivo da rejeição.");
            return;
        }
        if (isSubmitting || submission.status !== "PENDENTE") return;

        setRejectionError(null);
        setPendingAction("reject");
        try {
            const updatedSubmission = await rejectAdminSubmission(submission.id, reason);
            setRejectionOpen(false);
            setRejectionReason("");
            await onSubmissionUpdated(updatedSubmission);
            toast.success("Submissão rejeitada com sucesso.");
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setPendingAction(null);
        }
    };

    const handleRejectionOpenChange = (open: boolean) => {
        if (isSubmitting) return;
        setRejectionOpen(open);
        if (!open) {
            setRejectionReason("");
            setRejectionError(null);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 pt-2">
            <Button
                type="button"
                onClick={() => setApprovalOpen(true)}
                disabled={isSubmitting}>
                <CheckCircle2 size={16} />
                Aprovar
            </Button>
            <Button
                type="button"
                variant="destructive"
                onClick={() => setRejectionOpen(true)}
                disabled={isSubmitting}>
                <XCircle size={16} />
                Rejeitar
            </Button>

            <Dialog
                open={approvalOpen}
                onOpenChange={(open) => {
                    if (!isSubmitting) setApprovalOpen(open);
                }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar aprovação</DialogTitle>
                        <DialogDescription>
                            A submissão será aprovada e seus dados serão sincronizados. Deseja
                            continuar?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setApprovalOpen(false)}
                            disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleApprove}
                            disabled={isSubmitting}>
                            {pendingAction === "approve" ? (
                                <LoaderCircle className="animate-spin" size={16} />
                            ) : (
                                <CheckCircle2 size={16} />
                            )}
                            Confirmar aprovação
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={rejectionOpen} onOpenChange={handleRejectionOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rejeitar submissão</DialogTitle>
                        <DialogDescription>
                            Informe o motivo que será apresentado à escola.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <label htmlFor="rejection-reason" className="text-sm font-medium">
                            Motivo da rejeição
                        </label>
                        <Textarea
                            id="rejection-reason"
                            value={rejectionReason}
                            maxLength={255}
                            rows={4}
                            disabled={isSubmitting}
                            aria-invalid={Boolean(rejectionError)}
                            onChange={(event) => {
                                setRejectionReason(event.target.value);
                                if (rejectionError) setRejectionError(null);
                            }}
                            placeholder="Descreva o que precisa ser corrigido..."
                        />
                        <div className="flex justify-between gap-3 text-xs">
                            <span className="text-red-600">{rejectionError}</span>
                            <span className="ml-auto text-gray-500">
                                {rejectionReason.length}/255
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleRejectionOpenChange(false)}
                            disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isSubmitting}>
                            {pendingAction === "reject" ? (
                                <LoaderCircle className="animate-spin" size={16} />
                            ) : (
                                <XCircle size={16} />
                            )}
                            Confirmar rejeição
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
