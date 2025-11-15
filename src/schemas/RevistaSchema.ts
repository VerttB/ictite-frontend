import z from "zod";
import { MaterialSchema } from "./MaterialSchema";

export const RevistaSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "O título não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    link: z.url("Deve ser uma URL válida"),
    type: z.enum(["video", "article", "book", "other"]),
    
});

export type RevistaType = z.infer<typeof RevistaSchema>;