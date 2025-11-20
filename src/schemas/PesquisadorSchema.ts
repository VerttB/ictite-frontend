import { RaceTypes } from "@/core/constants/race";
import { ResearcherTypes } from "@/core/constants/researcherType";
import { SexTypes } from "@/core/constants/sex";
import z from "zod";

export const PesquisadorSchema = z.object({
    name: z.string().min(1, "O nome não deve estar vazio"),
    sex: z.enum(Object.values(SexTypes), "Selecione um sexo válido"),
    race: z.enum(Object.values(RaceTypes), "Selecione uma raça válida"),
    type: z.enum(Object.values(ResearcherTypes), "Selecione um tipo válido"),
    lattes: z.string().min(1, "O Lattes não deve estar vazio"),
    school_id: z.string().min(1, "A escola não deve estar vazia"),
});

export type PesquisadorType = z.infer<typeof PesquisadorSchema>;
