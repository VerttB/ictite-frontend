import { apiClient } from "@/lib/api/client";
import { SchoolFormSubmission, SchoolFormDraftData, RequestDeadlineExtension } from "@/schemas/schoolSubmissionSchema";

export const schoolSubmissionService = {
    async getCurrentSubmission(): Promise<SchoolFormSubmission> {
        return apiClient.get<SchoolFormSubmission>("/submissions/current");
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
};
