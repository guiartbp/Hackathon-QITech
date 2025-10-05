import { z } from "zod";

export const InvestimentoSchema = z.object({
  propostaId: z.string().optional(),
  contratoId: z.string().optional(),
  investidorId: z.string().min(1, "ID do investidor é obrigatório"),
  valorAportado: z.number().min(0, "Valor aportado deve ser maior ou igual a zero"),
  percentualParticipacao: z.number().optional(),
  statusInvestimento: z.string().default("PENDENTE"),
  valorTotalRecebido: z.number().default(0),
  tirRealizado: z.number().optional(),
  dataInvestimento: z.string().datetime().optional(),
});

export type InvestimentoInput = z.infer<typeof InvestimentoSchema>;