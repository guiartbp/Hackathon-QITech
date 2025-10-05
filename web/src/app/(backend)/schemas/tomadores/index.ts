import { z } from "zod";

export const TomadorSchema = z.object({
  uidUsuario: z.string().min(1, "UID do usuário é obrigatório"),
  nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  cargo: z.string().optional(),
  statusCompliance: z.string().default("PENDENTE"),
});

export type TomadorInput = z.infer<typeof TomadorSchema>;