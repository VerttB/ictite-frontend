import z from "zod";
import { ImageSchema } from "./ImageSchema";

export const EscolaSchema = z.object({
    name: z.string().min(1, "O nome não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    cep: z.string().min(1, "O CEP não deve estar vazio"),
    images: z.any()
             .pipe(ImageSchema)
});

export type EscolaType = z.infer<typeof EscolaSchema>;