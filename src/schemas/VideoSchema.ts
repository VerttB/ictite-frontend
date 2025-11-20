import * as z from "zod";

export const VideoSchema = z.object({
    title: z.string().min(1, "O título não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    link: z.url("Deve ser uma URL válida"),
    type: z.enum(["video", "article", "book", "other"]),
});

export type VideoType = z.infer<typeof VideoSchema>;
