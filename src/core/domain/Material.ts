import { z } from "zod";
import { ImageSchema, OptionalImageCreateSchema } from "./Image";
import { SearchParamParser } from "../../schemas/Common";
import { MaterialType } from "../constants/materialType";

const OptionalUrlSchema = z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url("Link inválido").optional()
);

export const MaterialSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().min(1, "Descrição obrigatória"),
    link: OptionalUrlSchema,
    type: z.enum(Object.values(MaterialType), "Tipo inválido"),
    images: ImageSchema.array(),
});
export const MaterialCreateSchema = MaterialSchema.omit({
    id: true,
    images: true,
});

export const MaterialFormSchema = MaterialCreateSchema.and(
    z.object({
        images: OptionalImageCreateSchema,
    })
);

export const MaterialSearchParamsSchema = z.object({
    name: SearchParamParser.string,
    page: SearchParamParser.page,
});

export const MaterialUpdateSchema = z.object({
    name: z.string().min(1, "Nome obrigatório").optional(),
    description: z.string().optional(),
    link: OptionalUrlSchema,
    type: z.enum(Object.values(MaterialType), "Tipo inválido").optional(),
});

export const MaterialUpdateFormSchema = MaterialUpdateSchema.and(
    z.object({
        images: OptionalImageCreateSchema.optional(),
    })
);
export type Material = z.infer<typeof MaterialSchema>;
export type MaterialCreate = z.infer<typeof MaterialCreateSchema>;
export type MaterialSearchParams = z.infer<typeof MaterialSearchParamsSchema>;
export type MaterialUpdate = z.infer<typeof MaterialUpdateSchema>;
