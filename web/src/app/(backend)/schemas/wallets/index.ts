import { z } from "zod";

export const WalletSchema = z.object({
  uidUsuario: z.string().min(1, "UID do usuário é obrigatório"),
  saldoAtual: z.number().min(0).default(0),
  disponivelSaque: z.number().min(0).default(0),
  valorBloqueado: z.number().min(0).default(0),
});

export type WalletInput = z.infer<typeof WalletSchema>;