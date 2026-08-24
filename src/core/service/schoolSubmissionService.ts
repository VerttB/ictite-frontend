import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";
import {
    SchoolFormSubmission,
    SchoolFormDraftData,
    RequestDeadlineExtension,
    SchoolFormActivityLog,
} from "@/schemas/schoolSubmissionSchema";

export const schoolSubmissionService = {
    async getCurrentSubmission(): Promise<SchoolFormSubmission> {
        return apiClient.get<SchoolFormSubmission>("/submissions/current");
    },

    async getLatestSubmission(): Promise<SchoolFormSubmission> {
        return apiClient.get<SchoolFormSubmission>("/submissions/latest");
    },

    async createDraft(): Promise<SchoolFormSubmission> {
        return apiClient.post<SchoolFormSubmission>("/submissions/", {});
    },

    async saveDraft(version: number, data: SchoolFormDraftData): Promise<SchoolFormSubmission> {
        return apiClient.put<SchoolFormSubmission>("/submissions/current", {
            version,
            data,
        });
    },

    async submitDraft(): Promise<SchoolFormSubmission> {
        return apiClient.post<SchoolFormSubmission>("/submissions/current/submit", {});
    },

    async refreshDraft(): Promise<SchoolFormSubmission> {
        return apiClient.post<SchoolFormSubmission>("/submissions/current/refresh", {});
    },

    async reopenDraft(): Promise<SchoolFormSubmission> {
        return apiClient.post<SchoolFormSubmission>("/submissions/current/reopen", {});
    },

    async requestDeadlineExtension(payload: RequestDeadlineExtension): Promise<SchoolFormSubmission> {
        return apiClient.post<SchoolFormSubmission>("/submissions/current/request-deadline-extension", payload);
    },

    async getLogs(page = 1, size = 20): Promise<Pagination<SchoolFormActivityLog>> {
        return apiClient.get<Pagination<SchoolFormActivityLog>>("/submissions/logs", {
            params: { page, size },
        });
    },

    async getFormImage(): Promise<{ url: string | null; path: string | null }> {
        return apiClient.get<{ url: string | null; path: string | null }>("/submissions/current/image");
    },

    async uploadFormImage(file: File): Promise<{ url: string; path: string }> {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.post<{ url: string; path: string }>("/submissions/current/image", formData);
    },

    async deleteFormImage(): Promise<void> {
        return apiClient.delete<void>("/submissions/current/image");
    },
};
