import { z } from "zod";
import { ImageCreateSchema, ImageSchema } from "./Image";
import { SearchParamParser } from "../../schemas/Common";

export const VideoSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().min(1, "Descrição obrigatória"),
    link: z.url("Link inválido").optional(),
    images: ImageSchema.array(),
})


export const VideoCreateSchema = VideoSchema.omit({ 
    id: true,
    images: true,
}).and(
    z.object({
        images: z.any().pipe(ImageCreateSchema),
    })
    
);
export const VideoSearchParamsSchema = z.object({
    name: SearchParamParser.string,
    page: SearchParamParser.page,
})


export type Video = z.infer<typeof VideoSchema>;
export type VideoCreate = z.infer<typeof VideoCreateSchema>;
export type VideoSearchParams = z.infer<typeof VideoSearchParamsSchema>;