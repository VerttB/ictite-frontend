import { z } from "zod";
import { SimpleIdNameSchema, SearchParamParser } from "../../schemas/Common";
import { ImageSchema, OptionalImageCreateSchema } from "./Image";
import { ResearcherSchema } from "./Researcher";
import { PaginationSearchParamsSchema } from "@/schemas/Pagination";
const currentYear = new Date().getFullYear();
const OptionalProjectYearSchema = z.preprocess(
    (value) => value === "" || value === null || value === undefined ? undefined : Number(value),
    z.number().int("Informe um ano válido").min(1900, "Informe um ano válido").optional()
);
const ProjectYearsSchema = z.object({
    start_year: OptionalProjectYearSchema.refine(
        (year) => year === undefined || year <= currentYear,
        "O ano de início não pode ser posterior ao ano atual."
    ),
    end_year: OptionalProjectYearSchema.refine(
        (year) => year === undefined || year >= currentYear,
        "O ano de conclusão não pode ser anterior ao ano atual."
    ),
}).refine(
    ({ start_year, end_year }) => start_year === undefined || end_year === undefined || end_year >= start_year,
    { path: ["end_year"], message: "O ano de conclusão não pode ser anterior ao ano de início." }
);

export const ProjectSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().nullish(),
    description_long: z.string().nullish(),
    start_year: z.number().int().nullish(),
    end_year: z.number().int().nullish(),
    clube: SimpleIdNameSchema,
    school: SimpleIdNameSchema.nullish(),
    images: ImageSchema.array(),
});

export const ProjectCreateSchema = ProjectSchema.pick({
    name: true,
}).and(
    z.object({
        description: z.string().nullish(),
        description_long: z.string().nullish(),
        clube_ciencia_id: z.uuid(),
    })
).and(ProjectYearsSchema);

export const ProjectFormSchema = ProjectCreateSchema.and(
    z.object({
        images: OptionalImageCreateSchema,
    })
);

export const ProjectUpdateSchema = z.object({
    name: z.string().min(1, "Nome obrigatório").optional(),
    description: z.string().nullish(),
    description_long: z.string().nullish(),
    clube_ciencia_id: z.uuid().optional(),
}).and(ProjectYearsSchema);

export const ProjectUpdateFormSchema = ProjectUpdateSchema.and(
    z.object({
        images: OptionalImageCreateSchema.optional(),
    })
);

export const ProjectSearchParamsSchema = z
    .object({
        name: SearchParamParser.string,
        clube: SearchParamParser.string,
        clube_ciencia_id: SearchParamParser.string,
        school_id: SearchParamParser.string,
        start_year: SearchParamParser.number,
    })
    .and(PaginationSearchParamsSchema);

export const ProjectResearchersSchema = z.record(z.string(), ResearcherSchema.array());

export const ProjectStatisticSchema = z.object({
    total_alunos: z.number().int().nonnegative(),
    total_professores: z.number().int().nonnegative(),
    total_facilitadores: z.number().int().nonnegative(),
});
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
export type ProjectSearchParams = z.infer<typeof ProjectSearchParamsSchema>;
export type ProjectResearchers = z.infer<typeof ProjectResearchersSchema>;
export type ProjectStatistic = z.infer<typeof ProjectStatisticSchema>;
