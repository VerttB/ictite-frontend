// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import type { SchoolFormDataInput } from "@/schemas/schoolSubmissionSchema";
import { ResearcherItemForm } from "./sub-entities/ResearcherItemForm";
import { ClubSitePreview } from "./ClubSitePreview";
import { SchoolFormPreview } from "./SchoolFormPreview";

vi.mock("swr", () => ({ default: vi.fn(() => ({ data: undefined })) }));
vi.mock("@/core/service/schoolSubmissionService", () => ({
    schoolSubmissionService: {},
}));
vi.mock("@/core/service/TipoEquipamentoService", () => ({ getEquipamentTypes: vi.fn() }));
vi.mock("@/core/service/IdentityTerritoryService", () => ({ getTerritories: vi.fn() }));
vi.mock("@/components/ui/ImageDisplay", () => ({
    ImageDisplay: ({ src, alt }: { src?: string; alt: string }) => (
        <span role="img" aria-label={alt} data-src={src} />
    ),
}));

const imageUrl = "https://simcc.example.test/integrated.jpg";
const data: SchoolFormDataInput = {
    school: { name: "Escola de teste" },
    clubs: [],
    projects: [],
    researchers: [
        {
            id: "00000000-0000-4000-8000-000000000001",
            name: "Pesquisadora integrada",
            type: "Professor",
            project_ids: [],
            image: imageUrl,
        },
    ],
    equipments: [],
};

function ResearcherForm() {
    const form = useForm<SchoolFormDataInput>({ defaultValues: data });
    return (
        <ResearcherItemForm
            index={0}
            fieldId="researcher"
            form={form}
            projects={[]}
            isExpanded
            onToggleExpand={() => undefined}
            onRemove={() => undefined}
        />
    );
}

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("fotos de pesquisadores pela integração", () => {
    it("não oferece envio de arquivos no cadastro", () => {
        const { container } = render(<ResearcherForm />);
        expect(container.querySelector('input[type="file"]')).toBeNull();
        expect(
            screen.getByText(/foto do pesquisador é obtida automaticamente/)
        ).toBeDefined();
    });

    it("usa a foto integrada na prévia do portal sem consultar uploads do pesquisador", async () => {
        render(<ClubSitePreview data={data} />);
        await userEvent.click(screen.getByRole("tab", { name: "Pesquisadores" }));
        expect(
            screen
                .getByRole("img", { name: "Foto de Pesquisadora integrada" })
                .getAttribute("data-src")
        ).toBe(imageUrl);
        expect(
            vi
                .mocked(useSWR)
                .mock.calls.some(([key]) => String(key).includes("images/researcher"))
        ).toBe(false);
    });

    it("usa a foto integrada na revisão sem consultar galeria de pesquisador", () => {
        render(
            <SchoolFormPreview
                data={data}
                mode="review"
                isSubmitting={false}
                deadlineExpired={false}
                onBack={() => undefined}
                onSubmit={() => undefined}
            />
        );
        expect(
            screen
                .getByRole("img", { name: "Foto de Pesquisadora integrada" })
                .getAttribute("data-src")
        ).toBe(imageUrl);
        expect(
            vi
                .mocked(useSWR)
                .mock.calls.some(
                    ([key]) => Array.isArray(key) && key.includes("researcher")
                )
        ).toBe(false);
    });
});
