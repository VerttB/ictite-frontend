import { SubmissionStatus } from "@/core/service/adminSubmissionService";

const statusClasses: Record<SubmissionStatus, string> = {
    RASCUNHO: "bg-slate-100 text-slate-700",
    PENDENTE: "bg-amber-100 text-amber-800",
    REJEITADO: "bg-red-100 text-red-700",
    APROVADO: "bg-emerald-100 text-emerald-800",
};

interface SubmissionStatusBadgeProps {
    status: SubmissionStatus;
}

export function SubmissionStatusBadge({ status }: SubmissionStatusBadgeProps) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}>
            {status}
        </span>
    );
}
