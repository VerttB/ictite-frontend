import { z } from "zod";

export const SchoolDraftDataSchema = z.object({
    name: z.string(),
    city: z.string().optional(),
    cep: z.string().optional(),
    description: z.string().optional(),
    instagram_url: z.string().optional(),
});

export const ClubDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z.string(),
    instagram_url: z.string().optional(),
});

export const ProjectDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z.string(),
    description: z.string().optional(),
    clube_ciencia_id: z.string(),
    year: z.number().int().optional(),
});

export const ResearcherDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z.string(),
    type: z.enum(["Aluno", "Professor", "Facilitador"]),
    gender: z.string().optional(),
    race: z.string().optional(),
    lattes_id: z.string().optional(),
    project_ids: z.array(z.string().uuid()).default([]),
});

export const EquipmentDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z.string(),
    quantity: z.number(),
    type_equipment_id: z.string(),
});

// Solução provisória para permitir que o formulário seja validado mesmo com campos opcionais, mas que não sejam nulos ou indefinidos.
export type SchoolFormDataInput = z.input<typeof SchoolFormDraftDataSchema>;

export const SchoolFormDraftDataSchema = z.object({
    school: SchoolDraftDataSchema,
    clubs: z.array(ClubDraftDataSchema),
    projects: z.array(ProjectDraftDataSchema),
    researchers: z.array(ResearcherDraftDataSchema),
    equipments: z.array(EquipmentDraftDataSchema),
});

export const SchoolFormFinalDataSchema = SchoolFormDraftDataSchema.superRefine(
    (data, context) => {
        const addIssue = (path: (string | number)[], message: string) =>
            context.addIssue({ code: "custom", path, message });

        if (data.school.name.trim().length < 2) {
            addIssue(["school", "name"], "Informe o nome da escola");
        }
        if (data.clubs.length === 0) {
            addIssue(["clubs"], "Cadastre ao menos um clube de ciência");
        }
        if (data.projects.length === 0) {
            addIssue(["projects"], "Cadastre ao menos um projeto");
        }
        if (data.researchers.length === 0) {
            addIssue(["researchers"], "Cadastre ao menos um pesquisador");
        }

        const clubIds = new Set(data.clubs.map((club) => club.id));
        const projectIds = new Set(data.projects.map((project) => project.id));

        data.clubs.forEach((club, index) => {
            if (club.name.trim().length < 2) {
                addIssue(["clubs", index, "name"], "Informe o nome do clube");
            }
        });

        data.projects.forEach((project, index) => {
            if (project.name.trim().length < 2) {
                addIssue(["projects", index, "name"], "Informe o nome do projeto");
            }
            if (
                !z.string().uuid().safeParse(project.clube_ciencia_id).success ||
                !clubIds.has(project.clube_ciencia_id)
            ) {
                addIssue(
                    ["projects", index, "clube_ciencia_id"],
                    "Selecione um clube deste formulário"
                );
            }
        });

        data.researchers.forEach((researcher, index) => {
            if (researcher.name.trim().length < 2) {
                addIssue(["researchers", index, "name"], "Informe o nome do pesquisador");
            }
            researcher.project_ids.forEach((projectId, projectIndex) => {
                if (!projectIds.has(projectId)) {
                    addIssue(
                        ["researchers", index, "project_ids", projectIndex],
                        "Selecione somente projetos deste formulário"
                    );
                }
            });
        });

        data.equipments.forEach((equipment, index) => {
            if (equipment.name.trim().length < 2) {
                addIssue(["equipments", index, "name"], "Informe o nome do equipamento");
            }
            if (!Number.isInteger(equipment.quantity) || equipment.quantity < 1) {
                addIssue(
                    ["equipments", index, "quantity"],
                    "Informe uma quantidade válida"
                );
            }
            if (!z.string().uuid().safeParse(equipment.type_equipment_id).success) {
                addIssue(
                    ["equipments", index, "type_equipment_id"],
                    "Selecione um tipo de equipamento válido"
                );
            }
        });
    }
);

export const RequestDeadlineExtensionSchema = z.object({
    requested_deadline: z.string().min(1, "Selecione uma data limite válida"),
    reason: z
        .string()
        .min(5, "Informe a justificativa com no mínimo 5 caracteres")
        .max(500, "A justificativa deve ter no máximo 500 caracteres"),
});

export type SchoolDraftData = z.infer<typeof SchoolDraftDataSchema>;
export type ClubDraftData = z.infer<typeof ClubDraftDataSchema>;
export type ProjectDraftData = z.infer<typeof ProjectDraftDataSchema>;
export type ResearcherDraftData = z.infer<typeof ResearcherDraftDataSchema>;
export type EquipmentDraftData = z.infer<typeof EquipmentDraftDataSchema>;
export type SchoolFormDraftData = z.infer<typeof SchoolFormDraftDataSchema>;
export type RequestDeadlineExtension = z.infer<typeof RequestDeadlineExtensionSchema>;

export interface SchoolFormSubmission {
    id: string;
    school_id: string;
    status: "RASCUNHO" | "PENDENTE" | "APROVADO" | "REJEITADO";
    version: number;
    data: SchoolFormDataInput;
    base_timestamp: string;
    has_conflict: boolean;
    submitted_by?: string | null;
    rejection_reason?: string | null;
    custom_deadline?: string | null;
    extension_requested_at?: string | null;
    requested_deadline?: string | null;
    extension_reason?: string | null;
    extension_status?: "Pendente" | "Aprovado" | "Rejeitado" | null;
    created_at: string;
    updated_at: string;
}
