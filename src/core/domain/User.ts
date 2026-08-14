import z from "zod";

export const UserRoleSchema = z.enum([
    "MANAGER",
    "ADMIN",
    "VIEWER",
    "SCHOOL_ADMIN",
]);

export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email("Email inválido"),
    role: UserRoleSchema,
    school_id: z.string().uuid().nullable().default(null),
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
export type UserRole = z.infer<typeof UserRoleSchema>;