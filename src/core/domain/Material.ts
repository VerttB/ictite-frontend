import { z } from "zod";
import { ImageCreateSchema, ImageSchema } from "./Image";
import { SearchParamParser } from "../../schemas/Common";

export const MaterialSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().min(1, "Descrição obrigatória"),
    link: z.string().url("Link inválido").optional(),
    images: ImageSchema.array(),
})


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
})


export type Material = z.infer<typeof MaterialSchema>;
export type MaterialCreate = z.infer<typeof MaterialCreateSchema>;
export type MaterialSearchParams = z.infer<typeof MaterialSearchParamsSchema>;