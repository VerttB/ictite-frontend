import z from "zod";

export const EquipmentTypeSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().optional(),
});

export const EquipmentTypeCreateSchema = z.object({
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().optional(),
});

export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;
export type EquipmentTypeCreate = z.infer<typeof EquipmentTypeCreateSchema>;
