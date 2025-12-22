import { SearchParamParser, SimpleIdNameSchema } from "@/schemas/Common";
import z from "zod";
import { ImageCreateSchema, ImageSchema } from "./Image";

export const ScienceClubSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "O nome não deve estar vazio"),
    description: z.string().min(1, "A descrição não deve estar vazia"),
    school: SimpleIdNameSchema,
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
    })
);

export const ScienceClubSearchParamsSchema = z.object({
    name: SearchParamParser.string,
    school: SearchParamParser.string,
});

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