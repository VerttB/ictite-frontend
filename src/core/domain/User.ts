import z from "zod";

export const UserSchema = z.object({
    id: z.string(),
    username: z.string().optional(),
    email: z.string().email("Email inválido"),
    role: z.string().optional(),
    school_id: z.string().nullable().optional(),
    created_at: z.string().optional(),
});

export const UserLoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type User = z.infer<typeof UserSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
