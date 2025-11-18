import * as z from "zod";
import { ImageSchema } from "./ImageSchema";

export const ProjetoSchema = z.object({
    name: z.string().min(1, "O nome não deve estar vazio"),
    school_id: z.string().min(1, "A escola não deve estar vazia"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    images: z.any()
             .pipe(ImageSchema)
});

export type ProjetoType = z.infer<typeof ProjetoSchema>;