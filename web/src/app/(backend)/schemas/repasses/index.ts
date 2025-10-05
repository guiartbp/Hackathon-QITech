import { z } from "zod";

export const RepasseSchema = z.object({
  pagamentoId: z.string().min(1, "ID do pagamento é obrigatório"),
  investimentoId: z.string().min(1, "ID do investimento é obrigatório"),
  investidorId: z.string().min(1, "ID do investidor é obrigatório"),
  valorRepasse: z.number().min(0, "Valor do repasse deve ser maior ou igual a zero"),
  principalDevolvido: z.number().optional(),
  retornoBruto: z.number().optional(),
  status: z.string().default("PENDENTE"),
  dataExecucao: z.string().datetime().optional(),
});

export type RepasseInput = z.infer<typeof RepasseSchema>;