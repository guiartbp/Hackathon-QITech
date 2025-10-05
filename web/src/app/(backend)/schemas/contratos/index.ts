import { z } from "zod";

export const ContratoSchema = z.object({
  propostaId: z.string().min(1, "ID da proposta é obrigatório"),
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  valorPrincipal: z.number().min(0, "Valor principal deve ser maior ou igual a zero"),
  multiploCap: z.number().min(0, "Múltiplo cap deve ser maior ou igual a zero"),
  percentualMrr: z.number().min(0, "Percentual MRR deve ser maior ou igual a zero"),
  valorTotalDevido: z.number().min(0, "Valor total devido deve ser maior ou igual a zero"),
  dataInicio: z.string().datetime("Data de início inválida"),
  dataFimPrevista: z.string().datetime().optional(),
  dataFimReal: z.string().datetime().optional(),
  statusContrato: z.string().default("ATIVO"),
  valorTotalPago: z.number().default(0),
  percentualPago: z.number().default(0),
  multiploAtingido: z.number().default(0),
  ultimaMetricaMensalId: z.string().optional(),
});

export type ContratoInput = z.infer<typeof ContratoSchema>;