import * as z from "zod";
import { ImageSchema } from "./ImageSchema";

export const MaterialSchema = z.object({
    name: z.string().min(1, "O nome não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    link: z.url("Deve ser uma URL válida"),
    images: z.any().pipe(ImageSchema),
});

export type MaterialType = z.infer<typeof MaterialSchema>;
