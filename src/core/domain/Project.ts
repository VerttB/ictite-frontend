import { z } from "zod";
import { SimpleIdNameSchema, SearchParamParser } from "../../schemas/Common";
import { ImageSchema, ImageCreateSchema } from "./Image";
import { ResearcherSchema } from "./Researcher";
import { PaginationSearchParamsSchema } from "@/schemas/Pagination";

export const ProjectSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().min(1, "Descrição obrigatória"),
    description_long: z.string().min(1, "Descrição longa é obrigatória"),
    year: z.number().int().nonnegative(),
    clube: SimpleIdNameSchema,
    images: ImageSchema.array(),
});

export const ProjectCreateSchema = ProjectSchema.omit({
    id: true,
    clube: true,
    images: true,
}).and(
    z.object({
        clube_ciencia_id: z.uuid(),
        images: z.any().pipe(ImageCreateSchema).optional(),
    })
);

export const ProjectSearchParamsSchema = z
    .object({
        name: SearchParamParser.string,
        clube: SearchParamParser.string,
    })
    .and(PaginationSearchParamsSchema);

export const ProjectResearchersSchema = z.object({
    professores: ResearcherSchema.array(),
    alunos: ResearcherSchema.array(),
    facilitadores: ResearcherSchema.array(),
});

export const ProjectStatisticSchema = z.object({
    total_alunos: z.number().int().nonnegative(),
    total_professores: z.number().int().nonnegative(),
    total_coordenadores: z.number().int().nonnegative(),
});
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectSearchParams = z.infer<typeof ProjectSearchParamsSchema>;
export type ProjectResearchers = z.infer<typeof ProjectResearchersSchema>;
export type ProjectStatistic = z.infer<typeof ProjectStatisticSchema>;
