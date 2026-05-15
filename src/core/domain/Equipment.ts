import { z } from "zod";
import { SearchParamParser, SimpleIdNameSchema } from "../../schemas/Common";
import { ImageSchema, OptionalImageCreateSchema } from "./Image";

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
        images: OptionalImageCreateSchema,
    })
);

export const EquipmentSearchParamsSchema = z.object({
    name: SearchParamParser.string,
});

export const EquipmentUpdateSchema = z.object({
    name: z.string().min(1, "Nome obrigatório").optional(),
    school_id: z.uuid("A escola não deve estar vazia").optional(),
    type_equipment_id: z.uuid("O tipo de equipamento não deve estar vazio").optional(),
    images: OptionalImageCreateSchema.optional(),
});

export type Equipment = z.infer<typeof EquipmentSchema>;
export type EquipmentCreate = z.infer<typeof EquipmentCreateSchema>;
export type EquipmentSearchParams = z.infer<typeof EquipmentSearchParamsSchema>;
export type EquipmentUpdate = z.infer<typeof EquipmentUpdateSchema>;
