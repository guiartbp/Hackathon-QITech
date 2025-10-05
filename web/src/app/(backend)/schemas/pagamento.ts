import { z } from "zod";

export const createPagamentoSchema = z.object({
  contratoId: z.string().uuid("ID do contrato deve ser um UUID válido"),
  tipoPagamento: z.string().min(1, "Tipo de pagamento é obrigatório"),
  dataVencimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de vencimento deve ser uma data válida",
  }),
  dataPagamento: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Data de pagamento deve ser uma data válida",
    })
    .optional(),
  diasAtraso: z.number().int().min(0, "Dias de atraso deve ser maior ou igual a 0").optional(),
  mrrPeriodo: z
    .number()
    .positive("MRR do período deve ser positivo")
    .multipleOf(0.01, "MRR do período deve ter no máximo 2 casas decimais")
    .optional(),
  valorEsperado: z
    .number()
    .positive("Valor esperado deve ser positivo")
    .multipleOf(0.01, "Valor esperado deve ter no máximo 2 casas decimais"),
  valorPago: z
    .number()
    .positive("Valor pago deve ser positivo")
    .multipleOf(0.01, "Valor pago deve ter no máximo 2 casas decimais")
    .optional(),
  valorAcumuladoPago: z
    .number()
    .positive("Valor acumulado pago deve ser positivo")
    .multipleOf(0.01, "Valor acumulado pago deve ter no máximo 2 casas decimais")
    .optional(),
  multiploAtingido: z
    .number()
    .positive("Múltiplo atingido deve ser positivo")
    .multipleOf(0.01, "Múltiplo atingido deve ter no máximo 2 casas decimais")
    .optional(),
  status: z.string().optional(),
  taxaEfetiva: z
    .number()
    .min(0, "Taxa efetiva deve ser maior ou igual a 0")
    .max(100, "Taxa efetiva deve ser menor ou igual a 100")
    .multipleOf(0.01, "Taxa efetiva deve ter no máximo 2 casas decimais")
    .optional(),
  metodoPagamento: z.string().optional(),
});

export const updatePagamentoSchema = createPagamentoSchema.partial().omit({
  contratoId: true,
});

export const pagamentoQuerySchema = z.object({
  contratoId: z.string().uuid().optional(),
  status: z.string().optional(),
  tipoPagamento: z.string().optional(),
  dataVencimentoInicio: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de vencimento início deve ser uma data válida",
  }).optional(),
  dataVencimentoFim: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de vencimento fim deve ser uma data válida",
  }).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type CreatePagamentoInput = z.infer<typeof createPagamentoSchema>;
export type UpdatePagamentoInput = z.infer<typeof updatePagamentoSchema>;
export type PagamentoQueryInput = z.infer<typeof pagamentoQuerySchema>;