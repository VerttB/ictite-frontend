import z from "zod";
import { PaginationSearchParamsSchema } from "@/schemas/Pagination";
import { SearchParamParser } from "@/schemas/Common";

const ScienceClubMinSchema = z.object({
    id: z.string().uuid(),
    name: z.string()
});

export const CoordinatorSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "O nome não deve estar vazio"),
    area: z.string().min(1, "A área não deve estar vazia"),
    clube_id: z.string().uuid().nullable(),
});

export const CoordinatorWithClubSchema = CoordinatorSchema.extend({
    clube: ScienceClubMinSchema
});

export const CoordinatorCreateSchema = CoordinatorSchema.omit({
    id: true,
});

export const CoordinatorUpdateSchema = CoordinatorSchema.pick({
    name: true,
    area: true,
    clube_id: true,
}).partial();

export const CoordinatorSearchParamsSchema = z
    .object({
        name: SearchParamParser.string,
        area: SearchParamParser.string,
        clube_id: SearchParamParser.string,
    })
    .and(PaginationSearchParamsSchema);

// Schema simplificado para retorno dentro do Clube
export const CoordinatorSimplifiedSchema = CoordinatorSchema.pick({
    id: true,
    name: true,
});

export type Coordinator = z.infer<typeof CoordinatorSchema>;
export type CoordinatorWithClub = z.infer<typeof CoordinatorWithClubSchema>;
export type CoordinatorCreate = z.infer<typeof CoordinatorCreateSchema>;
export type CoordinatorUpdate = z.infer<typeof CoordinatorUpdateSchema>;
export type CoordinatorSimplified = z.infer<typeof CoordinatorSimplifiedSchema>;