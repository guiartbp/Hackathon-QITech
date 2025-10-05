import { z } from "zod";

export const EmpresaSchema = z.object({
  tomadorId: z.string().min(1, "ID do tomador é obrigatório"),
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
  nomeFantasia: z.string().optional(),
  website: z.string().optional(),
  segmento: z.string().optional(),
  setor: z.string().optional(),
  estagioInvestimento: z.string().optional(),
  descricaoCurta: z.string().optional(),
  descricaoCompleta: z.string().optional(),
  produto: z.string().optional(),
  dataFundacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de fundação deve estar no formato YYYY-MM-DD").optional(),
  numeroFuncionarios: z.number().optional(),
  emoji: z.string().optional(),
});

export type EmpresaInput = z.infer<typeof EmpresaSchema>;