import { z } from "zod";
import { SimpleIdNameSchema, SearchParamParser } from "../../schemas/Common";
import { ImageSchema, OptionalImageCreateSchema } from "./Image";
import { ResearcherSchema } from "./Researcher";
import { PaginationSearchParamsSchema } from "@/schemas/Pagination";
import { yearValidation } from "../constants/validation";

const OptionalProjectYearSchema = z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z
        .string()
        .length(4, "Ano deve ter 4 dígitos")
        .refine(
            (val) => {
                const yearNum = Number(val);
                return yearNum >= yearValidation.min && yearNum <= yearValidation.max;
            },
            { message: "Ano inválido" }
        )
        .optional()
);

export const ProjectSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().nullish(),
    description_long: z.string().nullish(),
    year: z.union([z.string(), z.number()]).nullish(),
    clube: SimpleIdNameSchema,
    images: ImageSchema.array(),
});

export const ProjectCreateSchema = ProjectSchema.pick({
    name: true,
}).and(
    z.object({
        description: z.string().optional(),
        description_long: z.string().optional(),
        year: OptionalProjectYearSchema,
        clube_ciencia_id: z.uuid(),
        images: OptionalImageCreateSchema,
    })
);

export const ProjectUpdateSchema = z.object({
    name: z.string().min(1, "Nome obrigatório").optional(),
    description: z.string().optional(),
    description_long: z.string().optional(),
    year: OptionalProjectYearSchema,
    clube_ciencia_id: z.uuid().optional(),
    images: OptionalImageCreateSchema.optional(),
});

export const ProjectSearchParamsSchema = z
    .object({
        name: SearchParamParser.string,
        clube: SearchParamParser.string,
    })
    .and(PaginationSearchParamsSchema);

export const ProjectResearchersSchema = z.record(z.string(), ResearcherSchema.array());

export const ProjectStatisticSchema = z.object({
    total_alunos: z.number().int().nonnegative(),
    total_professores: z.number().int().nonnegative(),
    total_coordenadores: z.number().int().nonnegative(),
});
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
export type ProjectSearchParams = z.infer<typeof ProjectSearchParamsSchema>;
export type ProjectResearchers = z.infer<typeof ProjectResearchersSchema>;
export type ProjectStatistic = z.infer<typeof ProjectStatisticSchema>;
