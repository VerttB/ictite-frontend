import type { z } from "zod";
import {
    SchoolFormFinalDataSchema,
    type SchoolFormDataInput,
} from "@/schemas/schoolSubmissionSchema";

const sectionLabels = {
    school: "dados principais da escola",
    clubs: "clubes de ciência",
    projects: "projetos de pesquisa",
    researchers: "pesquisadores",
    equipments: "equipamentos",
} as const;

type Section = keyof typeof sectionLabels;
const sections = Object.keys(sectionLabels) as Section[];

export function normalizeOptionalYear(value: unknown): number | undefined {
    if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
    ) {
        return undefined;
    }
    return Number(value);
}

function removeNulls(value: unknown): unknown {
    if (value === null) return undefined;
    if (Array.isArray(value)) return value.map(removeNulls);
    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([key, field]) => [key, removeNulls(field)])
        );
    }
    return value;
}

export function normalizeSchoolFormData(data: SchoolFormDataInput): SchoolFormDataInput {
    const normalized = removeNulls(data) as SchoolFormDataInput;
    return {
        ...normalized,
        school: {
            ...normalized.school,
            identity_territory_id: normalized.school?.identity_territory_id || undefined,
        },
        clubs: normalized.clubs || [],
        projects: (normalized.projects || []).map((project) => ({
            ...project,
            start_year: normalizeOptionalYear(project.start_year),
            end_year: normalizeOptionalYear(project.end_year),
        })),
        researchers: (normalized.researchers || []).map((researcher) => ({
            ...researcher,
            lattes_id: researcher.lattes_id?.trim() || undefined,
        })),
        equipments: normalized.equipments || [],
    };
}

export function getSchoolFormIssueMessage(issue: z.ZodIssue): string {
    const section = issue.path[0] as Section;
    const index = typeof issue.path[1] === "number" ? `, item ${issue.path[1] + 1}` : "";
    const label = sectionLabels[section];
    return label ? `${label}${index}: ${issue.message}` : issue.message;
}

export function getDraftValidationMessage(error: z.ZodError): string {
    return error.issues[0]
        ? getSchoolFormIssueMessage(error.issues[0])
        : "Preencha os campos obrigatórios para salvar o rascunho.";
}

export function getSchoolFormValidation(data: SchoolFormDataInput) {
    const result = SchoolFormFinalDataSchema.safeParse(normalizeSchoolFormData(data));
    const issues = result.success ? [] : result.error.issues;
    const invalidSections = new Set(issues.map((issue) => issue.path[0] as Section));
    const valid = Object.fromEntries(
        sections.map((section) => [section, !invalidSections.has(section)])
    ) as Record<Section, boolean>;
    const incompleteCounts = Object.fromEntries(
        sections.map((section) => [
            section,
            new Set(
                issues
                    .filter(
                        (issue) =>
                            issue.path[0] === section && typeof issue.path[1] === "number"
                    )
                    .map((issue) => issue.path[1])
            ).size,
        ])
    ) as Record<Section, number>;
    return {
        issues,
        valid,
        incompleteCounts,
        canSubmit: result.success,
        pendingSections: sections
            .filter((section) => invalidSections.has(section))
            .map((section) => sectionLabels[section]),
    };
}

export function getSchoolFormPendingSections(data: SchoolFormDataInput): string[] {
    return getSchoolFormValidation(data).pendingSections;
}
