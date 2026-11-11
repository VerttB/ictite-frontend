import z from "zod";

export const GenerateInviteResponseSchema = z.object({
    school_id: z.string().uuid(),
    invite_token: z.string().min(1, "Token de convite inválido"),
    expires_at: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Data de expiração inválida",
    }),
});

export const RegisterInvitedRequestSchema = z.object({
    invite_token: z.string().min(1, "Token de convite obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(10, "A senha deve ter pelo menos 10 caracteres")
        .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/, "Use maiúscula, minúscula, número e símbolo"),
});

export type GenerateInviteResponse = z.infer<
    typeof GenerateInviteResponseSchema
>;
export type RegisterInvitedRequest = z.infer<
    typeof RegisterInvitedRequestSchema
>;
