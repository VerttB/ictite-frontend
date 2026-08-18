import { AdminSubmissions } from "@/components/console/AdminSubmissions";
import {
    AdminSubmissionSearchParams,
    SubmissionStatus,
} from "@/core/service/adminSubmissionService";

interface AdminSubmissionsPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const statuses: SubmissionStatus[] = [
    "RASCUNHO",
    "PENDENTE",
    "REJEITADO",
    "APROVADO",
];

export default async function AdminSubmissionsPage({
    searchParams,
}: AdminSubmissionsPageProps) {
    const rawParams = await searchParams;
    const rawStatus = typeof rawParams.status === "string" ? rawParams.status : undefined;
    const parsedStatus = statuses.includes(rawStatus as SubmissionStatus)
        ? (rawStatus as SubmissionStatus)
        : undefined;
    const parsedPage = Number(rawParams.page);
    const parsedSize = Number(rawParams.size);
    const params: AdminSubmissionSearchParams = {
        page: Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
        size: Number.isInteger(parsedSize) && parsedSize > 0 ? parsedSize : 20,
        status: parsedStatus,
    };

    return <AdminSubmissions params={params} />;
}
