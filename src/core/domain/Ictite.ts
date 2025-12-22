import z from "zod";

export const IctiteSchema = z.object({
    id: z.string().uuid(),
    objective: z.string().min(1, "Objetivo obrigatório"),
    link_project: z.string().url("Link do projeto inválido"),
});

export type Ictite = z.infer<typeof IctiteSchema>;
