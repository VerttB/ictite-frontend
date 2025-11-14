import * as z from "zod";

export const genericItemSchema = z.object({
  titulo: z.string().min(3, "Título é obrigatório e deve ter pelo menos 3 caracteres"),
  link: z.url("Informe um link válido"),
  descricao: z.string().min(5, "Descrição é obrigatória"),
});

export type GenericItemFormData = z.infer<typeof genericItemSchema>;
