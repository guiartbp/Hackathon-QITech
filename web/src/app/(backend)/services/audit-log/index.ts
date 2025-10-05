import { prisma } from "@/lib/prisma";
import { AuditLogInput } from "../../schemas/audit-log";

export const AuditLogService = {
  listar: async () => {
    return prisma.auditLog.findMany();
  },

  buscarPorId: async (id: string) => {
    return prisma.auditLog.findUnique({
      where: { id },
    });
  },

  criar: async (dados: AuditLogInput) => {
    return prisma.auditLog.create({
      data: dados,
    });
  },

  atualizar: async (id: string, dados: AuditLogInput) => {
    return prisma.auditLog.update({
      where: { id },
      data: dados,
    });
  },

  remover: async (id: string) => {
    return prisma.auditLog.delete({ where: { id } });
  },
};