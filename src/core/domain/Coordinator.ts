import z from "zod";
import { PaginationSearchParamsSchema } from "@/schemas/Pagination";
import { SearchParamParser } from "@/schemas/Common";

const ScienceClubMinSchema = z.object({
    id: z.string().uuid(),
    name: z.string()
});

export const CoordinatorSchema = z.object({
    id: z.string().uuid(),
    clube_id: z.string().uuid(),
    researcher_id: z.string().uuid("Selecione um professor válido"),
    name: z.string(), 
});

export const CoordinatorWithClubSchema = CoordinatorSchema.extend({
    clube: ScienceClubMinSchema
});

export const CoordinatorCreateSchema = z.object({
    clube_id: z.string().uuid(),
    researcher_id: z.string().uuid("Selecione um professor válido"),
});

export const CoordinatorUpdateSchema = CoordinatorCreateSchema.partial();

export const CoordinatorSearchParamsSchema = z
    .object({
        clube_id: SearchParamParser.string,
    })
    .and(PaginationSearchParamsSchema);

export const CoordinatorSimplifiedSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});

export type Coordinator = z.infer<typeof CoordinatorSchema>;
export type CoordinatorWithClub = z.infer<typeof CoordinatorWithClubSchema>;
export type CoordinatorCreate = z.infer<typeof CoordinatorCreateSchema>;
export type CoordinatorUpdate = z.infer<typeof CoordinatorUpdateSchema>;
export type CoordinatorSimplified = z.infer<typeof CoordinatorSimplifiedSchema>;