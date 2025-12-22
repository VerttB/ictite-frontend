import { z } from "zod";
import { ImageCreateSchema, ImageSchema } from "./Image";
import { SearchParamParser } from "../../schemas/Common";

export const MagazineSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().min(1, "Descrição obrigatória"),
    link: z.url("Link inválido"),
    images: ImageSchema.array(),
})


export const MagazineCreateSchema = MagazineSchema.omit({ 
    id: true,
    images: true,
}).and(
    z.object({
        images: z.any().pipe(ImageCreateSchema),
    })
    
);
export const MagazineSearchParamsSchema = z.object({
    name: SearchParamParser.string,
    page: SearchParamParser.page,
})


export type Magazine = z.infer<typeof MagazineSchema>;
export type MagazineCreate = z.infer<typeof MagazineCreateSchema>;
export type MagazineSearchParams = z.infer<typeof MagazineSearchParamsSchema>;