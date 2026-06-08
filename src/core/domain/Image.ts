import { z } from "zod";
import { isAcceptedImageFile, MAX_IMAGE_SIZE } from "../constants/Image";

export const ImageSchema = z.object({
  id: z.uuid(),
  url: z.url(),
});

export type Image = z.infer<typeof ImageSchema>;

const isValidFile = (f: any) => {
    // If it's an existing image object from backend, we consider it valid
    if (f && typeof f === "object" && !("size" in f) && ("url" in f || "id" in f)) {
        return true;
    }
    // Otherwise, check if it's a File and validate
    if (f instanceof File) {
        return f.size <= MAX_IMAGE_SIZE && isAcceptedImageFile(f);
    }
    return false;
};

const isSizeValid = (f: any) => {
    if (f && typeof f === "object" && !("size" in f) && ("url" in f || "id" in f)) {
        return true;
    }
    return f instanceof File && f.size <= MAX_IMAGE_SIZE;
};

const isFormatValid = (f: any) => {
    if (f && typeof f === "object" && !("name" in f) && ("url" in f || "id" in f)) {
        return true;
    }
    return f instanceof File && isAcceptedImageFile(f);
};

export const ImageCreateSchema = z
    .any()
    .transform<any[]>((files) => Array.from(files ?? []))
    .refine((arr) => arr.length >= 1, "Envie pelo menos 1 imagem")
    .refine((arr) => arr.length <= 5, "Máximo de 5 imagens")
    .refine((arr) => arr.every(isSizeValid), "Máx 5MB")
    .refine((arr) => arr.every(isFormatValid), "Formato inválido");

export const OptionalImageCreateSchema = z
    .any()
    .transform<any[]>((files) => Array.from(files ?? []))
    .refine((arr) => arr.length <= 5, "Máximo de 5 imagens")
    .refine((arr) => arr.every(isSizeValid), "Máx 5MB")
    .refine((arr) => arr.every(isFormatValid), "Formato inválido");

