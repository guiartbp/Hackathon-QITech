import { z } from "zod";

export const PagamentoSchema = z.object({
  contratoId: z.string().min(1, "ID do contrato é obrigatório"),
  tipoPagamento: z.string().min(1, "Tipo de pagamento é obrigatório"),
  dataVencimento: z.string().datetime("Data de vencimento inválida"),
  dataPagamento: z.string().datetime().optional(),
  diasAtraso: z.number().int().default(0),
  mrrPeriodo: z.number().optional(),
  valorEsperado: z.number().min(0, "Valor esperado deve ser maior ou igual a zero"),
  valorPago: z.number().optional(),
  valorAcumuladoPago: z.number().optional(),
  multiploAtingido: z.number().optional(),
  status: z.string().default("AGENDADO"),
  taxaEfetiva: z.number().optional(),
  metodoPagamento: z.string().optional(),
});

export type PagamentoInput = z.infer<typeof PagamentoSchema>;