import * as z from "zod";
import { ImageSchema } from "./ImageSchema";

export const EquipmentSchema = z.object({
    name: z.string().min(1, "O nome do equipamento não deve estar vazio"),
    type_equipment_id: z
        .string()
        .min(1, "O tipo de equipamento não deve estar vazio"),
    school_id: z.string().min(1, "A escola não deve estar vazia"),
    images: z.any().pipe(ImageSchema),
});

export type EquipmentType = z.infer<typeof EquipmentSchema>;
