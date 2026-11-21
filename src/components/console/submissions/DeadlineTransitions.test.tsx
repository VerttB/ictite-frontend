// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    approveAdminSubmission,
    grantDeadlineExtension,
} from "@/core/service/adminSubmissionService";
import type { SchoolFormSubmission } from "@/schemas/schoolSubmissionSchema";
import { AdminSubmissionActions } from "./AdminSubmissionActions";
import { DeadlineExtensionDetailsDialog } from "./DeadlineExtensionDetailsDialog";
import { ExtensionStatusBadge } from "./ExtensionStatusBadge";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/core/service/adminSubmissionService", () => ({
    approveAdminSubmission: vi.fn(),
    rejectAdminSubmission: vi.fn(),
    grantDeadlineExtension: vi.fn(),
}));

const submission: SchoolFormSubmission = {
    id: "00000000-0000-4000-8000-000000000001",
    school_id: "00000000-0000-4000-8000-000000000002",
    status: "PENDENTE",
    version: 1,
    has_conflict: false,
    data: {
        school: { name: "Escola de teste" },
        clubs: [],
        projects: [],
        researchers: [],
        equipments: [],
    },
    extension_status: "Pendente",
    requested_deadline: "2030-12-31T23:59:59Z",
    extension_requested_at: "2026-01-01T00:00:00Z",
    extension_reason: "Revisar os projetos.",
    base_timestamp: "2026-01-01T00:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => vi.resetAllMocks());
afterEach(cleanup);

describe("confirmações de cancelamento automático", () => {
    it("avisa sobre o cancelamento do envio antes de conceder a prorrogação", async () => {
        const onGranted = vi.fn();
        const updated = {
            ...submission,
            status: "RASCUNHO" as const,
            extension_status: "Aprovado" as const,
        };
        vi.mocked(grantDeadlineExtension).mockResolvedValue(updated);
        render(
            <DeadlineExtensionDetailsDialog
                submission={submission}
                open
                onOpenChange={vi.fn()}
                onGranted={onGranted}
            />
        );
        await userEvent.click(
            screen.getByRole("button", { name: "Conceder prorrogação" })
        );
        expect(screen.getByText(/O envio anterior será cancelado/)).toBeTruthy();
        expect(grantDeadlineExtension).not.toHaveBeenCalled();
        await userEvent.click(
            screen.getByRole("button", { name: "Confirmar concessão" })
        );
        await waitFor(() => expect(onGranted).toHaveBeenCalledWith(updated));
    });

    it("avisa antes de publicar uma submissão que ainda tenha pedido de prazo pendente", async () => {
        const onUpdated = vi.fn();
        const updated = {
            ...submission,
            status: "APROVADO" as const,
            extension_status: "Cancelado" as const,
        };
        vi.mocked(approveAdminSubmission).mockResolvedValue(updated);
        render(
            <AdminSubmissionActions
                submission={submission}
                onSubmissionUpdated={onUpdated}
            />
        );
        await userEvent.click(screen.getByRole("button", { name: "Aprovar" }));
        expect(
            screen.getByText(/solicitação de prorrogação pendente será cancelada/)
        ).toBeTruthy();
        expect(approveAdminSubmission).not.toHaveBeenCalled();
        await userEvent.click(
            screen.getByRole("button", { name: "Confirmar aprovação" })
        );
        await waitFor(() => expect(onUpdated).toHaveBeenCalledWith(updated));
    });

    it("exibe solicitações canceladas com seu estado próprio", () => {
        render(<ExtensionStatusBadge status="Cancelado" />);
        expect(screen.getByText("CANCELADO")).toBeTruthy();
    });
});
