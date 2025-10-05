import { z } from "zod";

// Schema para criar um novo contrato
export const createContratoSchema = z.object({
  propostaId: z.string().uuid("ID da proposta deve ser um UUID válido"),
  empresaId: z.string().uuid("ID da empresa deve ser um UUID válido"),
  valorPrincipal: z.number().positive("Valor principal deve ser positivo"),
  multiploCap: z.number().positive("Múltiplo CAP deve ser positivo"),
  percentualMrr: z.number().min(0).max(100, "Percentual MRR deve estar entre 0 e 100"),
  valorTotalDevido: z.number().positive("Valor total devido deve ser positivo"),
  dataInicio: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de início deve ser uma data válida"
  }),
  dataFimPrevista: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data fim prevista deve ser uma data válida"
  }).optional(),
  dataFimReal: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data fim real deve ser uma data válida"
  }).optional(),
  statusContrato: z.string().default("ATIVO"),
  valorTotalPago: z.number().min(0, "Valor total pago não pode ser negativo").default(0),
  percentualPago: z.number().min(0).max(100, "Percentual pago deve estar entre 0 e 100").default(0),
  multiploAtingido: z.number().min(0, "Múltiplo atingido não pode ser negativo").default(0),
  ultimaMetricaMensalId: z.string().uuid("ID da métrica mensal deve ser um UUID válido").optional(),
});

// Schema para atualizar um contrato existente
export const updateContratoSchema = z.object({
  propostaId: z.string().uuid("ID da proposta deve ser um UUID válido").optional(),
  empresaId: z.string().uuid("ID da empresa deve ser um UUID válido").optional(),
  valorPrincipal: z.number().positive("Valor principal deve ser positivo").optional(),
  multiploCap: z.number().positive("Múltiplo CAP deve ser positivo").optional(),
  percentualMrr: z.number().min(0).max(100, "Percentual MRR deve estar entre 0 e 100").optional(),
  valorTotalDevido: z.number().positive("Valor total devido deve ser positivo").optional(),
  dataInicio: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de início deve ser uma data válida"
  }).optional(),
  dataFimPrevista: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data fim prevista deve ser uma data válida"
  }).optional(),
  dataFimReal: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data fim real deve ser uma data válida"
  }).optional(),
  statusContrato: z.string().optional(),
  valorTotalPago: z.number().min(0, "Valor total pago não pode ser negativo").optional(),
  percentualPago: z.number().min(0).max(100, "Percentual pago deve estar entre 0 e 100").optional(),
  multiploAtingido: z.number().min(0, "Múltiplo atingido não pode ser negativo").optional(),
  ultimaMetricaMensalId: z.string().uuid("ID da métrica mensal deve ser um UUID válido").optional(),
});

// Schema para query params de filtros
export const contratoQuerySchema = z.object({
  empresaId: z.string().uuid("ID da empresa deve ser um UUID válido").optional(),
  propostaId: z.string().uuid("ID da proposta deve ser um UUID válido").optional(),
  statusContrato: z.string().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
});

// Tipos TypeScript exportados
export type CreateContratoData = z.infer<typeof createContratoSchema>;
export type UpdateContratoData = z.infer<typeof updateContratoSchema>;
export type ContratoQueryParams = z.infer<typeof contratoQuerySchema>;