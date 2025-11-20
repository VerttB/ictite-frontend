import z from "zod";
import { ImageSchema } from "./ImageSchema";
import { mask } from "@/lib/maskBuilder";

export const EscolaSchema = z.object({
    name: z.string().min(1, "O nome não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    cep: z
        .string()
        .length(9, "CEP deve ter 8 dígitos numericos")
        .refine((val) => {
            const onlyLetters = mask.onlyDigits(val);
            console.log(onlyLetters);
            return onlyLetters.length === 8;
        }, "CEP inválido"),

    images: z.any().pipe(ImageSchema),
});

export type EscolaType = z.infer<typeof EscolaSchema>;
