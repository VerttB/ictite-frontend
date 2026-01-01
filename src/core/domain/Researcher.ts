import { RaceTypes } from "@/core/constants/race";
import { ResearcherTypes } from "@/core/constants/researcherType";
import { GenderTypes } from "@/core/constants/sex";
import { SearchParamParser, SimpleIdNameSchema } from "@/schemas/Common";
import z from "zod";
import { ProjectSchema } from "./Project";
import { ImageSchema } from "./Image";
import { PaginationSearchParamsSchema } from "@/schemas/Pagination";

export const ResearcherSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "O nome não deve estar vazio"),
    gender: z.enum(Object.values(GenderTypes), "Selecione um gênero válido"),
    race: z.enum(Object.values(RaceTypes), "Selecione uma raça válida"),
    type: z.enum(Object.values(ResearcherTypes), "Selecione um tipo válido"),
    lattes_id: z.string().min(1, "O Lattes não deve estar vazio"),
    image: z.url().optional(),
});

export const ResearcherCreateSchema = z.object({
    name: z.string().min(1, "O nome não deve estar vazio"),
    gender: z.enum(Object.values(GenderTypes), "Selecione um gênero válido"),
    race: z.enum(Object.values(RaceTypes), "Selecione uma raça válida"),
    type: z.enum(Object.values(ResearcherTypes), "Selecione um tipo válido"),
    lattes_id: z
        .string()
        .min(1, "O Lattes não deve estar vazio")
        .length(16, "O ID do Lattes deve ter 16 caracteres"),
});

export const ResearcherUpdateSchema = ResearcherCreateSchema.extend({
    id: z.string().uuid(),
});

export const ResearcherSearchParamsSchema = z
    .object({
        name: SearchParamParser.string,
        gender: SearchParamParser.array,
        type: SearchParamParser.array,
        race: SearchParamParser.array,
    })
    .and(PaginationSearchParamsSchema);

export const ResearcherByTypeSchema = z.object({
    aluno: ResearcherSchema.array(),
    professor: ResearcherSchema.array(),
    coordenador: ResearcherSchema.array(),
});

const ResearcherSimccSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "O nome não deve estar vazio"),
    lattes_id: z.string().min(1, "O Lattes não deve estar vazio"),
    area: z.string().min(1, "A área não deve estar vazia"),
    city: z.string().min(1, "A cidade não deve estar vazia"),
    abstract: z.string().min(1, "O resumo não deve estar vazio"),
    orcid: z.string().min(1, "O ORCID não deve estar vazio"),
    graduation: z.string().min(1, "A graduação não deve estar vazia"),
});
const ResearcherArticleSchema = z.object({
    id: z.uuid(),
    title: z.string().min(1, "O título não deve estar vazio"),
    year: z.number().int().nonnegative(),
    abstract: z.string().min(1, "O resumo não deve estar vazio"),
});

export const ResearcherFinalSchema = ResearcherSchema.extend({
    simcc: ResearcherSimccSchema,
    articles: ResearcherArticleSchema.array(),
    projects: z.record(
        z.string(),
        SimpleIdNameSchema.array().and(
            z.object({ images: ImageSchema.array().optional() })
        )
    ),
});

export type Researcher = z.infer<typeof ResearcherSchema>;
export type ResearcherCreate = z.infer<typeof ResearcherCreateSchema>;
export type ResearcherUpdate = z.infer<typeof ResearcherUpdateSchema>;
export type ResearcherSearchParams = z.infer<typeof ResearcherSearchParamsSchema>;
export type ResearcherByType = z.infer<typeof ResearcherByTypeSchema>;
export type ResearcherFinal = z.infer<typeof ResearcherFinalSchema>;
export type ResearcherArticles = z.infer<typeof ResearcherArticleSchema>;
