import z from "zod";

export const ClubeSchema = z.object({
    title: z.string().min(1, "O título não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    school: z.string().min(1, "A escola não deve estar vazia"),
    
});

export type ClubeType = z.infer<typeof ClubeSchema>;