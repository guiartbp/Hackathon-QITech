import { z } from "zod";

export const AuditLogSchema = z.object({
  entidade: z.string().min(1, "Entidade é obrigatória"),
  entidadeId: z.string().min(1, "ID da entidade é obrigatório"),
  acao: z.string().min(1, "Ação é obrigatória"),
  usuarioId: z.string().min(1, "ID do usuário é obrigatório"),
  dadosAnteriores: z.any().optional(),
  dadosNovos: z.any().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export type AuditLogInput = z.infer<typeof AuditLogSchema>;