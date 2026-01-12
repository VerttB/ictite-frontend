import { z } from "zod";
import { ImageCreateSchema, ImageSchema } from "./Image";
import { SearchParamParser } from "../../schemas/Common";
import { MaterialType } from "../constants/materialType";

export const MaterialSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().min(1, "Descrição obrigatória"),
    link: z.string().url("Link inválido").optional(),
    type: z.enum(Object.values(MaterialType), "Tipo inválido"),
    images: ImageSchema.array(),
});

export const MaterialCreateSchema = MaterialSchema.omit({
    id: true,
    images: true,
}).and(
    z.object({
        images: z.any().pipe(ImageCreateSchema),
    })
);
export const MaterialSearchParamsSchema = z.object({
    name: SearchParamParser.string,
    page: SearchParamParser.page,
});

export const MaterialUpdateSchema = MaterialSchema.pick({
    name: true,
    description: true,
    link: true,
});
export type Material = z.infer<typeof MaterialSchema>;
export type MaterialCreate = z.infer<typeof MaterialCreateSchema>;
export type MaterialSearchParams = z.infer<typeof MaterialSearchParamsSchema>;
export type MaterialUpdate = z.infer<typeof MaterialUpdateSchema>;
