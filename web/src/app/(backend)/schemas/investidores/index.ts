import { z } from "zod";

export const InvestidorSchema = z.object({
  uidUsuario: z.string().min(1, "UID do usuário é obrigatório"),
  tipoPessoa: z.string().min(1, "Tipo de pessoa é obrigatório"),
  documentoIdentificacao: z.string().min(1, "Documento de identificação é obrigatório"),
  nomeRazaoSocial: z.string().min(1, "Nome/Razão social é obrigatório"),
  patrimonioLiquido: z.number().optional(),
  declaracaoRisco: z.boolean().default(false),
  experienciaAtivosRisco: z.boolean().optional(),
  modeloInvestimento: z.string().min(1, "Modelo de investimento é obrigatório"),
  fonteRecursos: z.string().optional(),
  statusKyc: z.string().default("PENDENTE"),
});

export type InvestidorInput = z.infer<typeof InvestidorSchema>;