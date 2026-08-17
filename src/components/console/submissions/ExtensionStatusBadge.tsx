import { ExtensionStatus } from "@/core/service/adminSubmissionService";

const statusStyles: Record<ExtensionStatus, string> = {
    Pendente: "border-amber-200 bg-amber-50 text-amber-700",
    Aprovado: "border-green-200 bg-green-50 text-green-700",
    Rejeitado: "border-red-200 bg-red-50 text-red-700",
};

export function ExtensionStatusBadge({ status }: { status: ExtensionStatus }) {
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
            {status.toUpperCase()}
        </span>
    );
}
