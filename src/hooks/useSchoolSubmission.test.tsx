// @vitest-environment jsdom
import { act, cleanup, fireEvent, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { schoolSubmissionService } from "@/core/service/schoolSubmissionService";
import type { SchoolFormSubmission } from "@/schemas/schoolSubmissionSchema";
import { useSchoolSubmission } from "./useSchoolSubmission";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/core/service/schoolSubmissionService", () => ({
    schoolSubmissionService: {
        getGlobalDeadline: vi.fn(),
        getCurrentSubmission: vi.fn(),
    },
}));

const pending: SchoolFormSubmission = {
    id: "00000000-0000-4000-8000-000000000001",
    school_id: "00000000-0000-4000-8000-000000000002",
    status: "PENDENTE",
    version: 1,
    data: {
        school: { name: "Escola de teste" },
        clubs: [],
        projects: [],
        researchers: [],
        equipments: [],
    },
    has_conflict: false,
    extension_status: "Pendente",
    base_timestamp: "2026-01-01T00:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(schoolSubmissionService.getGlobalDeadline).mockResolvedValue({
        school_forms_global_deadline: null,
    });
    vi.mocked(schoolSubmissionService.getCurrentSubmission).mockResolvedValue(
        structuredClone(pending)
    );
});
afterEach(cleanup);

describe("sincronização de decisões do formulário", () => {
    it("reabre o formulário ao voltar à janela depois da prorrogação aprovada", async () => {
        const { result } = renderHook(() => useSchoolSubmission());
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.submission?.status).toBe("PENDENTE");
        vi.mocked(schoolSubmissionService.getCurrentSubmission).mockResolvedValue({
            ...pending,
            status: "RASCUNHO",
            extension_status: "Aprovado",
            version: 2,
            custom_deadline: "2030-12-31T23:59:59Z",
        });
        fireEvent(window, new Event("focus"));
        await waitFor(() => expect(result.current.submission?.status).toBe("RASCUNHO"));
        expect(result.current.submission?.version).toBe(2);
        expect(result.current.submission?.extension_status).toBe("Aprovado");
        expect(result.current.form.getValues("school.name")).toBe("Escola de teste");
    });

    it("preserva alterações locais durante uma solicitação de prazo pendente", async () => {
        vi.mocked(schoolSubmissionService.getCurrentSubmission).mockResolvedValue({
            ...pending,
            status: "RASCUNHO",
        });
        const { result } = renderHook(() => useSchoolSubmission());
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        act(() =>
            result.current.form.setValue("school.name", "Edição ainda não salva", {
                shouldDirty: true,
            })
        );
        await waitFor(() => expect(result.current.form.formState.isDirty).toBe(true));
        fireEvent(window, new Event("focus"));
        expect(schoolSubmissionService.getCurrentSubmission).toHaveBeenCalledTimes(1);
        expect(result.current.form.getValues("school.name")).toBe(
            "Edição ainda não salva"
        );
    });
});
