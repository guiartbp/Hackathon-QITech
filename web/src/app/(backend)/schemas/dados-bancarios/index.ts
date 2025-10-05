import { z } from 'zod';
import type { Prisma } from '../../../../generated/prisma';

// Campos graváveis baseados no modelo DadosBancarios do Prisma
const writable = {
  usuario_id: z.string().uuid(),
  tipo_usuario: z.string().min(1), // Ex: "INVESTIDOR", "TOMADOR"
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  tipo_conta: z.string().optional(), // Ex: "CORRENTE", "POUPANCA"
  ispb: z.string().optional(),
  is_principal: z.coerce.boolean().optional(),
  ultima_validacao: z.coerce.date().optional(),
};

const dadosBancariosCreateSchema = z.object({
  usuario_id: writable.usuario_id,
  tipo_usuario: writable.tipo_usuario,
  banco: writable.banco,
  agencia: writable.agencia,
  conta: writable.conta,
  tipo_conta: writable.tipo_conta,
  ispb: writable.ispb,
  is_principal: writable.is_principal,
  ultima_validacao: writable.ultima_validacao,
});

const dadosBancariosUpdateSchema = dadosBancariosCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Nenhum campo para atualizar.' }
);

const dadosBancariosQuerySchema = z.object({
  id: z.string().optional(),
  usuario_id: z.string().optional(),
  tipo_usuario: z.string().optional(),
  is_principal: z.string().optional(),
  search: z.string().optional(),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});

export type DadosBancariosCreateDTO = z.infer<typeof dadosBancariosCreateSchema>;
export type DadosBancariosUpdateDTO = z.infer<typeof dadosBancariosUpdateSchema>;
export type DadosBancariosQueryDTO = z.infer<typeof dadosBancariosQuerySchema>;

export function parseCreate(body: any): Prisma.DadosBancariosCreateInput {
  const parsed = dadosBancariosCreateSchema.parse(body);
  return parsed as unknown as Prisma.DadosBancariosCreateInput;
}

export function parseUpdate(body: any): Prisma.DadosBancariosUpdateInput {
  const parsed = dadosBancariosUpdateSchema.parse(body);
  return parsed as unknown as Prisma.DadosBancariosUpdateInput;
}

export function parseQuery(url: string): DadosBancariosQueryDTO {
  const sp = new URL(url).searchParams;
  return dadosBancariosQuerySchema.parse({
    id: sp.get('id') ?? undefined,
    usuario_id: sp.get('usuario_id') ?? undefined,
    tipo_usuario: sp.get('tipo_usuario') ?? undefined,
    is_principal: sp.get('is_principal') ?? undefined,
    search: sp.get('search') ?? undefined,
    skip: sp.get('skip') ?? undefined,
    take: sp.get('take') ?? undefined,
  });
}