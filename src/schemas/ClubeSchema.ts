import z from "zod";
import { ImageSchema } from "./ImageSchema";

export const ClubeSchema = z.object({
    name: z.string().min(1, "O nome não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    school_id: z.string().min(1, "A escola não deve estar vazia"),
    images: z.any().pipe(ImageSchema),
});

export type ClubeType = z.infer<typeof ClubeSchema>;
