import { SearchParams } from "@/core/interface/SearchParams";
import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";
import { SchoolFormSubmission } from "@/schemas/schoolSubmissionSchema";

export type SubmissionStatus = SchoolFormSubmission["status"];
export type ExtensionStatus = NonNullable<SchoolFormSubmission["extension_status"]>;

export interface AdminSubmissionSearchParams extends SearchParams {
    page?: number;
    size?: number;
    status?: SubmissionStatus;
}

export interface DeadlineExtensionSearchParams extends SearchParams {
    page?: number;
    size?: number;
    status?: ExtensionStatus;
}

export interface GlobalDeadline {
    school_forms_global_deadline?: string | null;
    updated_at?: string | null;
}

export const getAdminSubmissions = async (
    params: AdminSubmissionSearchParams
): Promise<Pagination<SchoolFormSubmission>> => {
    const data = await apiClient.get<Pagination<SchoolFormSubmission>>(
        "/admin/submissions",
        { params }
    );

    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const getAdminSubmissionById = async (
    submissionId: string
): Promise<SchoolFormSubmission> => {
    return await apiClient.get<SchoolFormSubmission>(
        `/admin/submissions/${submissionId}`
    );
};

export const approveAdminSubmission = async (
    submissionId: string
): Promise<SchoolFormSubmission> => {
    return await apiClient.post<SchoolFormSubmission, undefined>(
        `/admin/submissions/${submissionId}/approve`,
        undefined
    );
};

export const rejectAdminSubmission = async (
    submissionId: string,
    reason: string
): Promise<SchoolFormSubmission> => {
    return await apiClient.post<SchoolFormSubmission, { reason: string }>(
        `/admin/submissions/${submissionId}/reject`,
        { reason }
    );
};

export const getDeadlineExtensionRequests = async (
    params: DeadlineExtensionSearchParams
): Promise<Pagination<SchoolFormSubmission>> => {
    const data = await apiClient.get<Pagination<SchoolFormSubmission>>(
        "/admin/submissions/deadline-extensions",
        { params }
    );

    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const getGlobalDeadline = async (): Promise<GlobalDeadline> => {
    return await apiClient.get<GlobalDeadline>("/admin/submissions/config/deadline");
};

export const grantDeadlineExtension = async (
    submissionId: string
): Promise<SchoolFormSubmission> => {
    return await apiClient.post<
        SchoolFormSubmission,
        { approved: true }
    >(`/admin/submissions/${submissionId}/grant-deadline-extension`, {
        approved: true,
    });
};
