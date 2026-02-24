import { SearchParamParser, SimpleIdNameSchema } from "@/schemas/Common";
import z from "zod";
import { ImageCreateSchema, ImageSchema } from "./Image";
import { PaginationSearchParamsSchema } from "@/schemas/Pagination";

export const ScienceClubSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "O nome não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    school: SimpleIdNameSchema,
    instagram: z.string().optional(),
    images: ImageSchema.array(),
});

export const ScienceClubCreateSchema = ScienceClubSchema.omit({
    id: true,
    school: true,
    images: true,
}).and(
    z.object({
        school_id: z.uuid(),
        images: z.any().pipe(ImageCreateSchema),
        instagram: z.string().optional(),
    })
);

export const ScienceClubUpdateSchema = ScienceClubSchema.pick({
    name: true,
    description: true,
    instagram: true,
}).partial();
export const ScienceClubSearchParamsSchema = z
    .object({
        name: SearchParamParser.string,
        school: SearchParamParser.string,
    })
    .and(PaginationSearchParamsSchema);

export const ScienceClubStatisticsAllSchema = z.object({
    total_clubes: z.number(),
    total_alunos: z.number(),
    total_professores: z.number(),
    total_coordenadores: z.number(),
    total_projetos: z.number(),
});

export const ScienceClubStatisticsSchema = z.object({
    total_alunos: z.number(),
    total_professores: z.number(),
    total_coordenadores: z.number(),
    total_projetos: z.number(),
});

export type ScienceClub = z.infer<typeof ScienceClubSchema>;
export type ScienceClubCreate = z.infer<typeof ScienceClubCreateSchema>;
export type ScienceClubSearchParams = z.infer<typeof ScienceClubSearchParamsSchema>;
export type ScienceClubStatistics = z.infer<typeof ScienceClubStatisticsSchema>;
export type ScienceClubStatisticsAll = z.infer<typeof ScienceClubStatisticsAllSchema>;
export type ScienceClubUpdate = z.infer<typeof ScienceClubUpdateSchema>;
