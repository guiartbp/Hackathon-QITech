import { z } from "zod";

export const InsightSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  categoria: z.string().optional(),
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  isLido: z.boolean().default(false),
  isArquivado: z.boolean().default(false),
  dataExpiracao: z.string().datetime().optional(),
});

export type InsightInput = z.infer<typeof InsightSchema>;