import { z } from 'zod';
import type { Prisma } from '../../../../generated/prisma';

const writable = {
  uid_usuario: z.string().min(1).optional(),
  cnpj: z.string().min(1),
  razao_social: z.string().min(1),
  segmento: z.string().optional(),
  estagio_investimento: z.string().min(1),
  produto: z.string().optional(),
  conta_bancaria_principal: z.string().optional(),
  plano_uso_fundos: z.string().optional(),
  status_compliance: z.string().optional(), // default 'PENDENTE' no banco
};

const tomadorCreateSchema = z.object({
  uid_usuario: writable.uid_usuario,
  cnpj: writable.cnpj,
  razao_social: writable.razao_social,
  segmento: writable.segmento,
  estagio_investimento: writable.estagio_investimento,
  produto: writable.produto,
  conta_bancaria_principal: writable.conta_bancaria_principal,
  plano_uso_fundos: writable.plano_uso_fundos,
  status_compliance: writable.status_compliance,
});

const tomadorUpdateSchema = tomadorCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Nenhum campo para atualizar.' }
);

const tomadorQuerySchema = z.object({
  id: z.string().optional(),
  uid_usuario: z.string().optional(),
  cnpj: z.string().optional(),
  search: z.string().optional(),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});

export type TomadorCreateDTO = z.infer<typeof tomadorCreateSchema>;
export type TomadorUpdateDTO = z.infer<typeof tomadorUpdateSchema>;
export type TomadorQueryDTO = z.infer<typeof tomadorQuerySchema>;

export function parseCreate(body: any): Prisma.TomadorCreateInput {
  const parsed = tomadorCreateSchema.parse(body);
  return parsed as unknown as Prisma.TomadorCreateInput;
}

export function parseUpdate(body: any): Prisma.TomadorUpdateInput {
  const parsed = tomadorUpdateSchema.parse(body);
  return parsed as unknown as Prisma.TomadorUpdateInput;
}

export function parseQuery(url: string): TomadorQueryDTO {
  const sp = new URL(url).searchParams;
  return tomadorQuerySchema.parse({
    id: sp.get('id') ?? undefined,
    uid_usuario: sp.get('uid_usuario') ?? undefined,
    cnpj: sp.get('cnpj') ?? undefined,
    search: sp.get('search') ?? undefined,
    skip: sp.get('skip') ?? undefined,
    take: sp.get('take') ?? undefined,
  });
}
