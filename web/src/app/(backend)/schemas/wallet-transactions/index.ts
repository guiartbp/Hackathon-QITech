import { z } from "zod";

export const WalletTransactionSchema = z.object({
  carteiraId: z.string().min(1, "ID da carteira é obrigatório"),
  uidUsuario: z.string().min(1, "UID do usuário é obrigatório"),
  tipo: z.enum(["DEPOSIT", "WITHDRAWAL", "INVESTMENT", "RETURN", "PIX_DEPOSIT", "PIX_WITHDRAWAL"]),
  valor: z.number().min(0, "Valor deve ser positivo"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED"]).default("PENDING"),
  referencia: z.string().optional(),
  metadata: z.any().optional(),
  processadoEm: z.string().datetime().optional(),
});

export type WalletTransactionInput = z.infer<typeof WalletTransactionSchema>;