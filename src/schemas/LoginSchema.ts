import { z } from 'zod';

export const userLoginSchema = z.object({
    username: z.string()
               .min(1, "O campo de nome não deve estar vazio"),
    password: z.string()
               .min(1, "O campo da senha não deve estar vazio")
});