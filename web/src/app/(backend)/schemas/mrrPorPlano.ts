import { z } from 'zod';

export const CreateMrrPorPlanoSchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido'),
  mesReferencia: z.string().or(z.date()).transform((val) => {
    if (val instanceof Date) return val;
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error('Data de referência inválida');
    }
    return date;
  }),
  nomePlano: z.string().min(1, 'Nome do plano é obrigatório').max(255, 'Nome do plano deve ter no máximo 255 caracteres'),
  mrrPlano: z.number().positive('MRR do plano deve ser um valor positivo').or(z.string().transform(Number)),
  numClientesPlano: z.number().int().positive('Número de clientes deve ser um inteiro positivo').optional().nullable(),
  percentualTotal: z.number().min(0).max(100, 'Percentual deve estar entre 0 e 100').optional().nullable(),
});

export const UpdateMrrPorPlanoSchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido').optional(),
  mesReferencia: z.string().or(z.date()).transform((val) => {
    if (val instanceof Date) return val;
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error('Data de referência inválida');
    }
    return date;
  }).optional(),
  nomePlano: z.string().min(1, 'Nome do plano é obrigatório').max(255, 'Nome do plano deve ter no máximo 255 caracteres').optional(),
  mrrPlano: z.number().positive('MRR do plano deve ser um valor positivo').or(z.string().transform(Number)).optional(),
  numClientesPlano: z.number().int().positive('Número de clientes deve ser um inteiro positivo').optional().nullable(),
  percentualTotal: z.number().min(0).max(100, 'Percentual deve estar entre 0 e 100').optional().nullable(),
});

export const QueryMrrPorPlanoSchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido').optional(),
  mesReferencia: z.string().optional(),
  nomePlano: z.string().optional(),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  orderBy: z.enum(['mesReferencia', 'nomePlano', 'mrrPlano', 'criadoEm']).default('mesReferencia'),
  orderDirection: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateMrrPorPlanoInput = z.infer<typeof CreateMrrPorPlanoSchema>;
export type UpdateMrrPorPlanoInput = z.infer<typeof UpdateMrrPorPlanoSchema>;
export type QueryMrrPorPlanoInput = z.infer<typeof QueryMrrPorPlanoSchema>;