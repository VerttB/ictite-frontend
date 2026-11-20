import { z } from "zod";

export const SchoolDraftDataSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Nome da escola deve ter no mínimo 2 caracteres")
        .max(100, "O nome da escola deve ter no máximo 100 caracteres"),
    city: z.string().optional(),
    cep: z.string().optional(),
    description: z.string().optional(),
    instagram_url: z.string().optional(),
    identity_territory_id: z
        .string()
        .uuid("Selecione um território válido")
        .optional()
        .or(z.literal("")),
});

export const ClubDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z
        .string()
        .trim()
        .min(2, "Nome do clube deve ter no mínimo 2 caracteres")
        .max(100, "O nome do clube deve ter no máximo 100 caracteres"),
    instagram_url: z.string().optional(),
    description: z.string().optional(),
});

export const ProjectDraftDataSchema = z
    .object({
        id: z.string().uuid("ID inválido"),
        name: z
            .string()
            .trim()
            .min(2, "Nome do projeto deve ter no mínimo 2 caracteres")
            .max(255, "O nome do projeto deve ter no máximo 255 caracteres"),
        description: z.string().optional(),
        long_description: z.string().optional(),
        clube_ciencia_id: z.string().uuid("Selecione um clube válido"),
        start_year: z
            .number()
            .int()
            .max(
                new Date().getFullYear(),
                "O ano de início não pode ser posterior ao ano atual."
            )
            .optional(),
        end_year: z
            .number()
            .int()
            .min(
                new Date().getFullYear(),
                "O ano de conclusão não pode ser anterior ao ano atual."
            )
            .optional(),
    })
    .refine(
        (data) =>
            data.start_year === undefined ||
            data.end_year === undefined ||
            data.end_year >= data.start_year,
        {
            message:
                "O ano de previsão de conclusão deve ser maior ou igual ao ano de início.",
            path: ["end_year"],
        }
    );

export const ResearcherDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z
        .string()
        .trim()
        .min(2, "Nome completo é obrigatório")
        .max(100, "O nome deve ter no máximo 100 caracteres"),
    type: z.enum(["Aluno", "Professor", "Facilitador"]),
    gender: z.string().optional(),
    race: z.string().optional(),
    lattes_id: z
        .string()
        .trim()
        .max(16, "O ID Lattes deve ter no máximo 16 caracteres")
        .optional(),
    image: z.string().optional(),
    project_ids: z
        .array(z.string().uuid())
        .min(1, "O pesquisador deve estar vinculado a pelo menos um projeto"),
});

export const EquipmentDraftDataSchema = z.object({
    id: z.string().uuid("ID inválido"),
    name: z
        .string()
        .trim()
        .min(2, "Nome do equipamento é obrigatório")
        .max(100, "O nome deve ter no máximo 100 caracteres"),
    quantity: z.number().min(1, "Quantidade deve ser no mínimo 1"),
    type_equipment_id: z.string().uuid("ID do tipo de equipamento inválido"),
});

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
        for (const [section, message] of [
            ["clubs", "Cadastre ao menos um clube de ciência."],
            ["projects", "Cadastre ao menos um projeto."],
            ["researchers", "Cadastre ao menos um pesquisador."],
        ] as const) {
            if (data[section].length === 0) {
                context.addIssue({ code: "custom", path: [section], message });
            }
        }

        if (data.school.cep && data.school.cep.replace(/\D/g, "").length !== 8) {
            context.addIssue({
                code: "custom",
                path: ["school", "cep"],
                message: "Informe um CEP com 8 dígitos.",
            });
        }

        const clubIds = new Set(data.clubs.map((club) => club.id));
        const projectIds = new Set(data.projects.map((project) => project.id));
        data.projects.forEach((project, index) => {
            if (!clubIds.has(project.clube_ciencia_id)) {
                context.addIssue({
                    code: "custom",
                    path: ["projects", index, "clube_ciencia_id"],
                    message: "Vincule o projeto a um clube deste formulário.",
                });
            }
        });
        data.researchers.forEach((researcher, index) => {
            if (researcher.project_ids.some((id) => !projectIds.has(id))) {
                context.addIssue({
                    code: "custom",
                    path: ["researchers", index, "project_ids"],
                    message: "Vincule o pesquisador apenas a projetos deste formulário.",
                });
            }
        });
    }
);

export const getEarliestExtensionDate = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Bahia",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());
    const dateParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const tomorrow = new Date(
        `${dateParts.year}-${dateParts.month}-${dateParts.day}T00:00:00Z`
    );
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
};

export const RequestDeadlineExtensionSchema = z.object({
    requested_deadline: z
        .string()
        .min(1, "Selecione uma data limite válida")
        .refine(
            (value) => !Number.isNaN(new Date(value).getTime()),
            "Selecione uma data limite válida"
        )
        .refine(
            (value) => value.slice(0, 10) >= getEarliestExtensionDate(),
            "Escolha uma data a partir de amanhã (horário da Bahia)."
        ),
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
    submitted_by_email?: string | null;
    rejection_reason?: string | null;
    custom_deadline?: string | null;
    extension_requested_at?: string | null;
    requested_deadline?: string | null;
    extension_reason?: string | null;
    extension_status?: "Pendente" | "Aprovado" | "Rejeitado" | null;
    created_at: string;
    updated_at: string;
}

export interface SchoolFormActivityLog {
    id: string;
    school_id: string;
    submission_id?: string | null;
    user_id: string;
    user_name?: string | null;
    action: string;
    details?: string | null;
    created_at: string;
}
