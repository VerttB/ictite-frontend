import * as z from "zod";

import { MAX_IMAGE_SIZE, ACCEPTED_IMAGE_TYPE } from "@/core/constants/Image";
export const ImageSchema = z
    .any()
    .transform<File[]>((files) => Array.from(files ?? []))
    .refine((arr) => arr.length >= 1, "Envie pelo menos 1 imagem")
    .refine((arr) => arr.length <= 5, "Máximo de 5 imagens") // opcional
    .refine((arr) => arr.every((f) => f.size <= MAX_IMAGE_SIZE), "Máx 5MB")
    .refine(
        (arr) => arr.every((f) => ACCEPTED_IMAGE_TYPE.includes(f.type)),
        "Formato inválido"
    );
