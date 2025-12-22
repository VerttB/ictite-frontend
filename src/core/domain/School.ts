import { z } from "zod";
import { ImageCreateSchema, ImageSchema } from "./Image";
import { SearchParamParser, SimpleIdNameSchema } from "@/schemas/Common";
import { mask } from "@/lib/maskBuilder";
export const SchoolSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Nome obrigatório"),
  city: z.string(),
  cep: z.string().min(8, "CEP obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
  clubs: SimpleIdNameSchema.array(),
  images: ImageSchema.array(),
  createdAt: z.date(),
});




export const SchoolCreateSchema = SchoolSchema.pick({ 
  name: true,
  description: true,
}, 
).and(
  z.object({
     cep: z
            .string()
            .length(9, "CEP deve ter 8 dígitos numericos")
            .transform((val) => mask.onlyDigits(val))
            .refine((val) => {
                return val.length === 8;
            }, "CEP inválido"),
    
    images: z.any().pipe(ImageCreateSchema),
  })
);

export const SchoolUpdateSchema = SchoolSchema.pick({
  name: true,
  description: true,
}).partial();


export const SchoolSearchParamsSchema = z.object({
  name: SearchParamParser.string,
  city: SearchParamParser.string,
  page: SearchParamParser.page,
});

export const SchoolStatisticsSchema = z.object({
    total_clubes: z.number().int().nonnegative(),
    total_pesquisadores: z.number().int().nonnegative(),
    total_equipamentos: z.number().int().nonnegative(),
    total_projetos: z.number().int().nonnegative(),
});

export type School = z.infer<typeof SchoolSchema>;
export type SchoolCreate = z.infer<typeof SchoolCreateSchema>;
export type SchoolUpdate = z.infer<typeof SchoolUpdateSchema>;
export type SchoolSearchParams = z.infer<typeof SchoolSearchParamsSchema>;
export type SchoolStatistics = z.infer<typeof SchoolStatisticsSchema>;