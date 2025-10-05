import { z } from "zod";

export const CohortsSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  cohortMes: z.string().datetime("Data inválida"),
  clientesIniciais: z.number().int().min(0, "Clientes iniciais deve ser maior ou igual a zero"),
  retencaoM0: z.number().default(100.00),
  retencaoM1: z.number().optional(),
  retencaoM2: z.number().optional(),
  retencaoM3: z.number().optional(),
  retencaoM6: z.number().optional(),
  retencaoM12: z.number().optional(),
  ltvMedio: z.number().optional(),
});

export type CohortsInput = z.infer<typeof CohortsSchema>;