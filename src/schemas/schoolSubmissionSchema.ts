import { z } from "zod";

export const SchoolDraftSchema = z.object({
    name: z.string().min(2, "Nome da escola é obrigatório"),
    city: z.string().nullable().optional(),
    cep: z.string().nullable().optional(),
});

export const ClubDraftSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Nome do clube é obrigatório"),
    instagram_url: z.string().nullable().optional(),
});

export const ProjectDraftSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Nome do projeto é obrigatório"),
    description: z.string().nullable().optional(),
    clube_ciencia_id: z.string().min(1, "Clube vinculado é obrigatório"),
    year: z.number().nullable().optional(),
});

export const ResearcherDraftSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Nome completo do pesquisador é obrigatório"),
    type: z.enum(["Aluno", "Professor", "Facilitador"]),
    gender: z.string().nullable().optional(),
    race: z.string().nullable().optional(),
    lattes_id: z.string().nullable().optional(),
    project_ids: z.array(z.string()),
});

export const EquipmentDraftSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Nome do equipamento é obrigatório"),
    quantity: z.number().min(1, "Quantidade mínima é 1"),
    type_equipment_id: z.string().min(1, "Tipo de equipamento é obrigatório"),
});

export const SchoolFormDraftDataSchema = z.object({
    school: SchoolDraftSchema,
    clubs: z.array(ClubDraftSchema),
    projects: z.array(ProjectDraftSchema),
    researchers: z.array(ResearcherDraftSchema),
    equipments: z.array(EquipmentDraftSchema),
});

export const SchoolFormSubmissionSchema = z.object({
    id: z.string(),
    school_id: z.string(),
    status: z.enum(["RASCUNHO", "PENDENTE", "APROVADO", "REJEITADO"]),
    version: z.number(),
    data: SchoolFormDraftDataSchema,
    base_timestamp: z.string(),
    has_conflict: z.boolean().default(false),
    submitted_by: z.string().nullable().optional(),
    rejection_reason: z.string().nullable().optional(),
    custom_deadline: z.string().nullable().optional(),
    extension_requested_at: z.string().nullable().optional(),
    requested_deadline: z.string().nullable().optional(),
    extension_reason: z.string().nullable().optional(),
    extension_status: z.enum(["Pendente", "Aprovado", "Rejeitado"]).nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export const RequestDeadlineExtensionSchema = z.object({
    requested_deadline: z.string().min(1, "Selecione a data limite desejada"),
    reason: z.string().min(10, "A justificativa deve ter no mínimo 10 caracteres").max(500, "Máximo 500 caracteres"),
});

export type SchoolDraft = z.infer<typeof SchoolDraftSchema>;
export type ClubDraft = z.infer<typeof ClubDraftSchema>;
export type ProjectDraft = z.infer<typeof ProjectDraftSchema>;
export type ResearcherDraft = z.infer<typeof ResearcherDraftSchema>;
export type EquipmentDraft = z.infer<typeof EquipmentDraftSchema>;
export type SchoolFormDraftData = z.infer<typeof SchoolFormDraftDataSchema>;
export type SchoolFormSubmission = z.infer<typeof SchoolFormSubmissionSchema>;
export type RequestDeadlineExtension = z.infer<typeof RequestDeadlineExtensionSchema>;
