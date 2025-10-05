import { z } from 'zod';
import type { Prisma } from '../../../../generated/prisma';

// Campos graváveis baseados no modelo Tomador do Prisma
const writable = {
  uid_usuario: z.string().min(1),
  nome_completo: z.string().min(1),
  email: z.string().email(),
  cargo: z.string().optional(),
  status_compliance: z.string().optional(), // default 'PENDENTE' no banco
};

const tomadorCreateSchema = z.object({
  uid_usuario: writable.uid_usuario,
  nome_completo: writable.nome_completo,
  email: writable.email,
  cargo: writable.cargo,
  status_compliance: writable.status_compliance,
});

const tomadorUpdateSchema = tomadorCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Nenhum campo para atualizar.' }
);

const tomadorQuerySchema = z.object({
  id: z.string().optional(),
  uid_usuario: z.string().optional(),
  email: z.string().optional(),
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
    email: sp.get('email') ?? undefined,
    search: sp.get('search') ?? undefined,
    skip: sp.get('skip') ?? undefined,
    take: sp.get('take') ?? undefined,
  });
}
