import z from "zod";
import { ImageSchema } from "./ImageSchema";

export const RevistaSchema = z.object({
    name: z.string().min(1, "O nome não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    link: z.url("Deve ser uma URL válida"),
    images: z.any().pipe(ImageSchema),
});

export type RevistaType = z.infer<typeof RevistaSchema>;
