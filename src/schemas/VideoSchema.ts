import * as z from "zod";

export const VideoSchema = z.object({
    name: z.string().min(1, "O nome não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    link: z.url("Deve ser uma URL válida"),
    type: z.enum(["video", "article", "book", "other"]),
});

export type VideoType = z.infer<typeof VideoSchema>;
