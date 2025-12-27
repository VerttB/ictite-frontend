import { z } from "zod";
import { SearchParamParser, SimpleIdNameSchema } from "../../schemas/Common";
import { ImageCreateSchema, ImageSchema } from "./Image";

export const EquipmentSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    type_equipment: SimpleIdNameSchema,
    school: SimpleIdNameSchema,
    images: ImageSchema.array(),
});


export const EquipmentCreateSchema = EquipmentSchema.omit({ 
    id: true,
    images: true,
    school: true,
    type_equipment: true,
}).and(
    z.object({
        school_id: z.uuid("A escola não deve estar vazia"),
        type_equipment_id: z.uuid("O tipo de equipamento não deve estar vazio"),
        images: z.any().pipe(ImageCreateSchema),
    })
);


export const EquipmentSearchParamsSchema = z.object({
    name: SearchParamParser.string,
})
export type Equipment = z.infer<typeof EquipmentSchema>;
export type EquipmentCreateType = z.infer<typeof EquipmentCreateSchema>;
export type EquipmentSearchParams = z.infer<typeof EquipmentSearchParamsSchema>;