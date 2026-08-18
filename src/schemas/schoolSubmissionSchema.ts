import { z } from "zod";

export const SchoolDraftDataSchema = z.object({
    name: z.string().min(2, "Nome da escola deve ter no mínimo 2 caracteres"),
    city: z.string().optional(),
    cep: z.string().optional(),
    description: z.string().optional(),
    instagram_url: z.string().optional(),
});

export const ClubDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z.string().min(2, "Nome do clube deve ter no mínimo 2 caracteres"),
    instagram_url: z.string().optional(),
});

export const ProjectDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z.string().min(2, "Nome do projeto deve ter no mínimo 2 caracteres"),
    description: z.string().optional(),
    clube_ciencia_id: z.string().uuid("Selecione um clube válido"),
    year: z.number().int().optional(),
});

export const ResearcherDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z.string().min(2, "Nome completo é obrigatório"),
    type: z.enum(["Aluno", "Professor", "Facilitador"]),
    gender: z.string().optional(),
    race: z.string().optional(),
    lattes_id: z.string().optional(),
    project_ids: z.array(z.string().uuid()).default([]),
});

export const EquipmentDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z.string().min(2, "Nome do equipamento é obrigatório"),
    quantity: z.number().min(1, "Quantidade deve ser no mínimo 1"),
    type_equipment_id: z.string().uuid("ID do tipo de equipamento inválido"),
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
