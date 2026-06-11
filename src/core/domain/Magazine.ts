import { z } from "zod";
import { ImageSchema, OptionalImageCreateSchema } from "./Image";
import { SearchParamParser } from "../../schemas/Common";

export const MagazineSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().min(1, "Descrição obrigatória"),
    link: z.url("Link inválido"),
    images: ImageSchema.array(),
});

export const MagazineCreateSchema = MagazineSchema.omit({
    id: true,
    images: true,
});

export const MagazineFormSchema = MagazineCreateSchema.and(
    z.object({
        images: OptionalImageCreateSchema,
    })
);

export const MagazineUpdateSchema = z.object({
    name: z.string().min(1, "Nome obrigatório").optional(),
    description: z.string().optional(),
    link: z.url("Link inválido").optional(),
});

export const MagazineUpdateFormSchema = MagazineUpdateSchema.and(
    z.object({
        images: OptionalImageCreateSchema.optional(),
    })
);
export const MagazineSearchParamsSchema = z.object({
    name: SearchParamParser.string,
    page: SearchParamParser.page,
});

export type Magazine = z.infer<typeof MagazineSchema>;
export type MagazineCreate = z.infer<typeof MagazineCreateSchema>;
export type MagazineSearchParams = z.infer<typeof MagazineSearchParamsSchema>;
export type MagazineUpdate = z.infer<typeof MagazineUpdateSchema>;
