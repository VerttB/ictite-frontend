import z from "zod";

export const UserSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(1, "Username obrigatório"),
    email: z.string().email("Email inválido"),
    created_at: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Data inválida",
    }),
});

export const UserLoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type User = z.infer<typeof UserSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
