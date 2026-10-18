import { z } from "zod";
import { isAcceptedImageFile, MAX_IMAGE_SIZE } from "../constants/Image";

export const ImageSchema = z.object({
    id: z.uuid(),
    url: z.url(),
});

export type Image = z.infer<typeof ImageSchema>;

const isSizeValid = (f: unknown) => {
    if (f && typeof f === "object" && !("size" in f) && ("url" in f || "id" in f)) {
        return true;
    }
    return f instanceof File && f.size <= MAX_IMAGE_SIZE;
};

const isFormatValid = (f: unknown) => {
    if (f && typeof f === "object" && !("name" in f) && ("url" in f || "id" in f)) {
        return true;
    }
    return f instanceof File && isAcceptedImageFile(f);
};

export const ImageCreateSchema = z
    .unknown()
    .transform((files): unknown[] =>
        Array.isArray(files) || (typeof FileList !== "undefined" && files instanceof FileList)
            ? Array.from(files)
            : []
    )
    .refine((arr) => arr.length >= 1, "Envie pelo menos 1 imagem")
    .refine((arr) => arr.length <= 5, "Máximo de 5 imagens")
    .refine((arr) => arr.every(isSizeValid), "Máx 5MB")
    .refine((arr) => arr.every(isFormatValid), "Formato inválido");

export const OptionalImageCreateSchema = z
    .unknown()
    .transform((files): unknown[] =>
        Array.isArray(files) || (typeof FileList !== "undefined" && files instanceof FileList)
            ? Array.from(files)
            : []
    )
    .refine((arr) => arr.length <= 5, "Máximo de 5 imagens")
    .refine((arr) => arr.every(isSizeValid), "Máx 5MB")
    .refine((arr) => arr.every(isFormatValid), "Formato inválido");
