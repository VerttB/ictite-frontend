import { z } from "zod";
import { ACCEPTED_IMAGE_TYPE, MAX_IMAGE_SIZE } from "../constants/Image";

export const ImageSchema = z.object({
  id: z.uuid(),
  url: z.url(),
});

export type Image = z.infer<typeof ImageSchema>;

export const ImageCreateSchema = z
    .any()
    .transform<File[]>((files) => Array.from(files ?? []))
    .refine((arr) => arr.length >= 1, "Envie pelo menos 1 imagem")
    .refine((arr) => arr.length <= 5, "Máximo de 5 imagens") // opcional
    .refine((arr) => arr.every((f) => f.size <= MAX_IMAGE_SIZE), "Máx 5MB")
    .refine(
        (arr) => arr.every((f) => ACCEPTED_IMAGE_TYPE.includes(f.type)),
        "Formato inválido"
    );
