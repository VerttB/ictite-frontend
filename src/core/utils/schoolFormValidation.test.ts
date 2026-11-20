import { createFormControl } from "react-hook-form";
import { describe, expect, it } from "vitest";
import {
    SchoolFormDraftDataSchema,
    type SchoolFormDataInput,
} from "@/schemas/schoolSubmissionSchema";
import {
    getDraftValidationMessage,
    getSchoolFormValidation,
    normalizeOptionalYear,
    normalizeSchoolFormData,
} from "./schoolFormValidation";

const clubId = "00000000-0000-4000-8000-000000000001";
const projectId = "00000000-0000-4000-8000-000000000002";
const otherId = "00000000-0000-4000-8000-000000000003";

function validDraft(): SchoolFormDataInput {
    return {
        school: { name: "Escola de teste", cep: "40010-000" },
        clubs: [{ id: clubId, name: "Clube de teste" }],
        projects: [{ id: projectId, name: "Projeto de teste", clube_ciencia_id: clubId }],
        researchers: [
            {
                id: otherId,
                name: "Pesquisadora de teste",
                type: "Aluno",
                project_ids: [projectId],
            },
        ],
        equipments: [],
    };
}

function backendResponse(): SchoolFormDataInput {
    const data = validDraft();
    return JSON.parse(
        JSON.stringify({
            ...data,
            school: {
                ...data.school,
                city: null,
                description: null,
                identity_territory_id: null,
            },
            projects: data.projects.map((project) => ({
                ...project,
                start_year: null,
                end_year: null,
            })),
        })
    );
}

describe("limites de armazenamento do formulário", () => {
    it.each([99, 100, 101])("confere nome da escola com %i caracteres", (length) => {
        const data = validDraft();
        data.school.name = "E".repeat(length);
        expect(getSchoolFormValidation(data).canSubmit).toBe(length <= 100);
    });
});

describe("anos opcionais no formulário escolar", () => {
    it.each([null, undefined, "", "   "])(
        "preserva ausência de ano recebida como %s",
        (value) => {
            expect(normalizeOptionalYear(value)).toBeUndefined();
        }
    );

    it("preserva um ano informado e não trata zero como ausência", () => {
        expect(normalizeOptionalYear("2024")).toBe(2024);
        expect(normalizeOptionalYear(0)).toBe(0);
    });

    it("permite revisar e enviar os anos ausentes recebidos da API", () => {
        const data = normalizeSchoolFormData(backendResponse());
        expect(data.projects[0].start_year).toBeUndefined();
        expect(data.projects[0].end_year).toBeUndefined();
        expect(SchoolFormDraftDataSchema.safeParse(data).success).toBe(true);
        expect(getSchoolFormValidation(data).canSubmit).toBe(true);
    });

    it("mantém anos vazios depois de registrar campos e repetir resets com respostas da API", () => {
        const form = createFormControl<SchoolFormDataInput>({
            defaultValues: normalizeSchoolFormData(backendResponse()),
        });
        const unsubscribe = form.subscribe({
            formState: { values: true },
            callback: () => {},
        });
        for (let cycle = 0; cycle < 3; cycle++) {
            form.register("projects.0.start_year", { setValueAs: normalizeOptionalYear });
            form.register("projects.0.end_year", { setValueAs: normalizeOptionalYear });
            expect(form.getValues("projects.0.end_year")).toBeUndefined();
            expect(getSchoolFormValidation(form.getValues()).canSubmit).toBe(true);
            form.reset(normalizeSchoolFormData(backendResponse()));
        }
        unsubscribe();
    });

    it("permite informar somente um dos anos", () => {
        const data = validDraft();
        data.projects[0].start_year = new Date().getFullYear();
        expect(getSchoolFormValidation(data).canSubmit).toBe(true);
        data.projects[0].start_year = undefined;
        data.projects[0].end_year = new Date().getFullYear();
        expect(getSchoolFormValidation(data).canSubmit).toBe(true);
    });

    it("mantém Lattes vazio como ausente ao salvar pesquisadores sem identificador", () => {
        const data = validDraft();
        data.researchers[0].lattes_id = "   ";
        const normalized = normalizeSchoolFormData(data);
        expect(normalized.researchers[0].lattes_id).toBeUndefined();
        expect(JSON.parse(JSON.stringify(normalized)).researchers[0]).not.toHaveProperty(
            "lattes_id"
        );
        expect(getSchoolFormValidation(normalized).canSubmit).toBe(true);
        data.researchers[0].lattes_id = "1234567890123456";
        expect(normalizeSchoolFormData(data).researchers[0].lattes_id).toBe(
            "1234567890123456"
        );
    });

    it("bloqueia o mesmo erro de ano na visão geral, revisão e envio", () => {
        const data = validDraft();
        data.projects[0].end_year = new Date().getFullYear() - 1;
        const result = getSchoolFormValidation(data);
        expect(result.canSubmit).toBe(false);
        expect(result.valid.projects).toBe(false);
        expect(result.incompleteCounts.projects).toBe(1);
        expect(result.pendingSections).toContain("projetos de pesquisa");
        const draft = SchoolFormDraftDataSchema.safeParse(data);
        expect(draft.success).toBe(false);
        if (!draft.success) {
            expect(getDraftValidationMessage(draft.error)).toContain("ano de conclusão");
            expect(getDraftValidationMessage(draft.error)).not.toContain(
                "nome e vínculo"
            );
        }
    });

    it("rejeita ano inicial futuro e intervalo de anos invertido", () => {
        const data = validDraft();
        data.projects[0].start_year = new Date().getFullYear() + 1;
        expect(getSchoolFormValidation(data).canSubmit).toBe(false);
        data.projects[0].end_year = new Date().getFullYear();
        expect(SchoolFormDraftDataSchema.safeParse(data).success).toBe(false);
    });
});

describe("revisão do formulário escolar", () => {
    it("permite salvar rascunho sem seções completas, mas bloqueia seu envio", () => {
        const data: SchoolFormDataInput = {
            school: { name: "Escola de teste" },
            clubs: [],
            projects: [],
            researchers: [],
            equipments: [],
        };
        expect(SchoolFormDraftDataSchema.safeParse(data).success).toBe(true);
        expect(getSchoolFormValidation(data).pendingSections).toEqual([
            "clubes de ciência",
            "projetos de pesquisa",
            "pesquisadores",
        ]);
    });

    it("bloqueia nome composto apenas por espaços", () => {
        const data = validDraft();
        data.school.name = "   ";
        expect(getSchoolFormValidation(data).valid.school).toBe(false);
    });

    it("bloqueia projeto de clube que não pertence ao formulário", () => {
        const data = validDraft();
        data.projects[0].clube_ciencia_id = otherId;
        expect(getSchoolFormValidation(data).valid.projects).toBe(false);
    });

    it("bloqueia pesquisador sem projeto ou vinculado a projeto ausente", () => {
        const data = validDraft();
        data.researchers[0].project_ids = [];
        expect(getSchoolFormValidation(data).valid.researchers).toBe(false);
        data.researchers[0].project_ids = [otherId];
        expect(getSchoolFormValidation(data).valid.researchers).toBe(false);
    });

    it("aceita projeto do próprio rascunho ainda não publicado", () => {
        const data = validDraft();
        data.projects.push({
            id: otherId,
            name: "Projeto novo",
            clube_ciencia_id: clubId,
        });
        data.researchers[0].project_ids = [otherId];
        expect(getSchoolFormValidation(data).canSubmit).toBe(true);
    });

    it("não indica formulário pronto com CEP incompleto", () => {
        const data = validDraft();
        data.school.cep = "123";
        expect(getSchoolFormValidation(data).valid.school).toBe(false);
        data.school.cep = "";
        expect(getSchoolFormValidation(data).canSubmit).toBe(true);
    });
});
