import { z } from 'zod';

export const userLoginSchema = z.object({
    username: z.string()
               .nonempty("O campo de nome não deve estar vazio"),
    password: z.string()
               .nonempty("O campo da senha não deve estar vazio")
});