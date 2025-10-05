import { z } from "zod";

export const DadosBancariosSchema = z.object({
  usuarioId: z.string().min(1, "ID do usuário é obrigatório"),
  tipoUsuario: z.string().min(1, "Tipo de usuário é obrigatório"),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  tipoConta: z.string().optional(),
  ispb: z.string().optional(),
  isPrincipal: z.boolean().default(false),
  ultimaValidacao: z.string().datetime().optional(),
});

export type DadosBancariosInput = z.infer<typeof DadosBancariosSchema>;