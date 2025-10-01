import { z } from 'zod';
import type { Prisma } from '../../../../generated/prisma';

// Campos graváveis
const writable = {
  uid_usuario: z.string().min(1).optional(),
  tipo_pessoa: z.string().optional(), // PF | PJ (pode trocar por z.enum(['PF','PJ']))
  documento_identificacao: z.string().min(1),
  nome_razao_social: z.string().min(1),
  data_onboarding: z.coerce.date().optional(),
  patrimonio_liquido: z.coerce.number().optional(),
  declaracao_risco: z.coerce.boolean(),
  experiencia_ativos_risco: z.coerce.boolean().optional(),
  modelo_investimento: z.string().min(1),
  fonte_recursos: z.string().optional(),
  status_kyc: z.string().optional(), // 'PENDENTE' por padrão no banco
};

const investidorCreateSchema = z.object({
  uid_usuario: writable.uid_usuario,
  tipo_pessoa: writable.tipo_pessoa,
  documento_identificacao: writable.documento_identificacao,
  nome_razao_social: writable.nome_razao_social,
  data_onboarding: writable.data_onboarding,
  patrimonio_liquido: writable.patrimonio_liquido,
  declaracao_risco: writable.declaracao_risco,
  experiencia_ativos_risco: writable.experiencia_ativos_risco,
  modelo_investimento: writable.modelo_investimento,
  fonte_recursos: writable.fonte_recursos,
  status_kyc: writable.status_kyc,
});

const investidorUpdateSchema = investidorCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Nenhum campo para atualizar.' }
);

const investidorQuerySchema = z.object({
  id: z.string().optional(),
  uid_usuario: z.string().optional(),
  documento_identificacao: z.string().optional(),
  search: z.string().optional(),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});

export type InvestidorCreateDTO = z.infer<typeof investidorCreateSchema>;
export type InvestidorUpdateDTO = z.infer<typeof investidorUpdateSchema>;
export type InvestidorQueryDTO = z.infer<typeof investidorQuerySchema>;

export function parseCreate(body: any): Prisma.InvestidorCreateInput {
  const parsed = investidorCreateSchema.parse(body);
  return parsed as unknown as Prisma.InvestidorCreateInput;
}

export function parseUpdate(body: any): Prisma.InvestidorUpdateInput {
  const parsed = investidorUpdateSchema.parse(body);
  return parsed as unknown as Prisma.InvestidorUpdateInput;
}

export function parseQuery(url: string): InvestidorQueryDTO {
  const sp = new URL(url).searchParams;
  return investidorQuerySchema.parse({
    id: sp.get('id') ?? undefined,
    uid_usuario: sp.get('uid_usuario') ?? undefined,
    documento_identificacao: sp.get('documento_identificacao') ?? undefined,
    search: sp.get('search') ?? undefined,
    skip: sp.get('skip') ?? undefined,
    take: sp.get('take') ?? undefined,
  });
}
