import { z } from "zod";

export const TopClientesSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  mesReferencia: z.string().datetime("Data inválida"),
  clienteNome: z.string().min(1, "Nome do cliente é obrigatório"),
  clienteEmoji: z.string().optional(),
  plano: z.string().optional(),
  mrrCliente: z.number().min(0, "MRR do cliente deve ser maior ou igual a zero"),
  percentualMrrTotal: z.number().optional(),
});

export type TopClientesInput = z.infer<typeof TopClientesSchema>;