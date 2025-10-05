import { z } from 'zod';
import type { Prisma } from '../../../../generated/prisma';

// Campos graváveis baseados no modelo Empresa do Prisma
const writable = {
  tomador_id: z.string().uuid(),
  cnpj: z.string().min(14).max(18), // CNPJ pode ter pontuação ou não
  razao_social: z.string().min(1),
  nome_fantasia: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  segmento: z.string().optional(),
  setor: z.string().optional(),
  estagio_investimento: z.string().optional(),
  descricao_curta: z.string().optional(),
  descricao_completa: z.string().optional(),
  produto: z.string().optional(),
  data_fundacao: z.string().datetime().optional(),
  numero_funcionarios: z.number().int().min(0).optional(),
  emoji: z.string().optional(),
};

const empresaCreateSchema = z.object({
  tomador_id: writable.tomador_id,
  cnpj: writable.cnpj,
  razao_social: writable.razao_social,
  nome_fantasia: writable.nome_fantasia,
  website: writable.website,
  segmento: writable.segmento,
  setor: writable.setor,
  estagio_investimento: writable.estagio_investimento,
  descricao_curta: writable.descricao_curta,
  descricao_completa: writable.descricao_completa,
  produto: writable.produto,
  data_fundacao: writable.data_fundacao,
  numero_funcionarios: writable.numero_funcionarios,
  emoji: writable.emoji,
});

const empresaUpdateSchema = empresaCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Nenhum campo para atualizar.' }
);

const empresaQuerySchema = z.object({
  id: z.string().optional(),
  tomador_id: z.string().optional(),
  cnpj: z.string().optional(),
  search: z.string().optional(),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});

export type EmpresaCreateDTO = z.infer<typeof empresaCreateSchema>;
export type EmpresaUpdateDTO = z.infer<typeof empresaUpdateSchema>;
export type EmpresaQueryDTO = z.infer<typeof empresaQuerySchema>;

export function parseCreate(body: any): Prisma.EmpresaCreateInput {
  const parsed = empresaCreateSchema.parse(body);
  
  // Converter data_fundacao para Date se fornecida
  const data: any = { ...parsed };
  if (data.data_fundacao) {
    data.dataFundacao = new Date(data.data_fundacao);
    delete data.data_fundacao;
  }
  
  // Mapear campos snake_case para camelCase conforme Prisma schema
  return {
    tomador: { connect: { id: data.tomador_id } },
    cnpj: data.cnpj,
    razaoSocial: data.razao_social,
    nomeFantasia: data.nome_fantasia,
    website: data.website,
    segmento: data.segmento,
    setor: data.setor,
    estagioInvestimento: data.estagio_investimento,
    descricaoCurta: data.descricao_curta,
    descricaoCompleta: data.descricao_completa,
    produto: data.produto,
    dataFundacao: data.dataFundacao,
    numeroFuncionarios: data.numero_funcionarios,
    emoji: data.emoji,
  } as Prisma.EmpresaCreateInput;
}

export function parseUpdate(body: any): Prisma.EmpresaUpdateInput {
  const parsed = empresaUpdateSchema.parse(body);
  
  // Converter data_fundacao para Date se fornecida
  const data: any = { ...parsed };
  if (data.data_fundacao) {
    data.dataFundacao = new Date(data.data_fundacao);
    delete data.data_fundacao;
  }
  
  // Mapear apenas campos presentes de snake_case para camelCase
  const mapped: any = {};
  if (data.tomador_id !== undefined) mapped.tomador = { connect: { id: data.tomador_id } };
  if (data.cnpj !== undefined) mapped.cnpj = data.cnpj;
  if (data.razao_social !== undefined) mapped.razaoSocial = data.razao_social;
  if (data.nome_fantasia !== undefined) mapped.nomeFantasia = data.nome_fantasia;
  if (data.website !== undefined) mapped.website = data.website;
  if (data.segmento !== undefined) mapped.segmento = data.segmento;
  if (data.setor !== undefined) mapped.setor = data.setor;
  if (data.estagio_investimento !== undefined) mapped.estagioInvestimento = data.estagio_investimento;
  if (data.descricao_curta !== undefined) mapped.descricaoCurta = data.descricao_curta;
  if (data.descricao_completa !== undefined) mapped.descricaoCompleta = data.descricao_completa;
  if (data.produto !== undefined) mapped.produto = data.produto;
  if (data.dataFundacao !== undefined) mapped.dataFundacao = data.dataFundacao;
  if (data.numero_funcionarios !== undefined) mapped.numeroFuncionarios = data.numero_funcionarios;
  if (data.emoji !== undefined) mapped.emoji = data.emoji;
  
  return mapped as Prisma.EmpresaUpdateInput;
}

export function parseQuery(url: string): EmpresaQueryDTO {
  const sp = new URL(url).searchParams;
  return empresaQuerySchema.parse({
    id: sp.get('id') ?? undefined,
    tomador_id: sp.get('tomador_id') ?? undefined,
    cnpj: sp.get('cnpj') ?? undefined,
    search: sp.get('search') ?? undefined,
    skip: sp.get('skip') ?? undefined,
    take: sp.get('take') ?? undefined,
  });
}