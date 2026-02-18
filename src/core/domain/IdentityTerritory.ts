import z from "zod";

export const IdentityTerritorySchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, "Nome obrigatório"),
    code: z.number().int().nonnegative("Código obrigatório"),
    headquarters_city: z.string().min(1, "Cidade sede obrigatória"),
});

export const IdentityTerritoryCreateSchema = IdentityTerritorySchema.omit({ id: true });
export const IdentityTerritoryUpdateSchema = IdentityTerritoryCreateSchema.partial();

export type IdentityTerritory = z.infer<typeof IdentityTerritorySchema>;
export type IdentityTerritoryCreate = z.infer<typeof IdentityTerritoryCreateSchema>;
export type IdentityTerritoryUpdate = z.infer<typeof IdentityTerritoryUpdateSchema>;
