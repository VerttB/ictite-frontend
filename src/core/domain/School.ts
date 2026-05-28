import { z } from "zod";
import { ImageSchema, OptionalImageCreateSchema } from "./Image";
import {
    SearchParamParser,
    SimpleIdNameDescriptionSchema,
    SimpleIdNameSchema,
} from "@/schemas/Common";
import { mask } from "@/lib/maskBuilder";
import { PaginationSearchParamsSchema } from "@/schemas/Pagination";
import { IdentityTerritorySchema } from "./IdentityTerritory";
export const SchoolSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    city: z.string().nullish(),
    cep: z.string().nullish(),
    description: z.string().nullish(),
    instagram: z.string().optional(),
    clubs: SimpleIdNameSchema.array(),
    images: ImageSchema.array(),
    identityTerritory: IdentityTerritorySchema.nullish(),
    createdAt: z.date(),
});

const CepSchema = z
    .string()
    .length(9, "CEP deve ter 8 dígitos numericos")
    .transform((val) => mask.onlyDigits(val))
    .refine((val) => {
        return val.length === 8;
    }, "CEP inválido");

export const SchoolCreateSchema = SchoolSchema.pick({
    name: true,
    description: true,
    instagram: true,
}).and(
    z.object({
        cep: CepSchema,

        images: OptionalImageCreateSchema,
        identity_territory_id: z.uuid().optional(),
    })
);

export const SchoolUpdateSchema = z.object({
    name: z.string().min(1, "Nome obrigatório").optional(),
    description: z.string().optional(),
    instagram: z.string().optional(),
    cep: CepSchema.optional(),
    identity_territory_id: z.uuid().nullish(),
    images: OptionalImageCreateSchema.optional(),
});

export const SchoolSearchParamsSchema = z
    .object({
        name: SearchParamParser.string,
        city: SearchParamParser.string,
    })
    .and(PaginationSearchParamsSchema);

export const SchoolStatisticsSchema = z.object({
    total_clubes: z.number().int().nonnegative(),
    total_pesquisadores: z.number().int().nonnegative(),
    total_equipamentos: z.number().int().nonnegative(),
    total_projetos: z.number().int().nonnegative(),
});

export const SchoolGeoJsonSchema = z.object({
    type: z.literal("FeatureCollection"),
    features: z.array(
        z.object({
            type: z.literal("Feature"),
            geometry: z.object({
                type: z.literal("Point"),
                coordinates: z.tuple([z.number(), z.number()]),
            }),
            properties: SimpleIdNameDescriptionSchema,
        })
    ),
});
export type School = z.infer<typeof SchoolSchema>;
export type SchoolCreate = z.infer<typeof SchoolCreateSchema>;
export type SchoolUpdate = z.infer<typeof SchoolUpdateSchema>;
export type SchoolSearchParams = z.infer<typeof SchoolSearchParamsSchema>;
export type SchoolStatistics = z.infer<typeof SchoolStatisticsSchema>;
export type SchoolGeoJson = z.infer<typeof SchoolGeoJsonSchema>;
