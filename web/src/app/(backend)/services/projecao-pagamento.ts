import { PrismaClient } from "@/generated/prisma";
import {
  CreateProjecaoPagamentoInput,
  UpdateProjecaoPagamentoInput,
} from "../schemas/projecao-pagamento";

const prisma = new PrismaClient();

export interface GetProjecoesPagamentoFilters {
  contratoId?: string;
  mesReferencia?: Date;
}

export class ProjecaoPagamentoService {
  static async getAll(filters?: GetProjecoesPagamentoFilters) {
    const where: any = {};

    if (filters?.contratoId) {
      where.contratoId = filters.contratoId;
    }

    if (filters?.mesReferencia) {
      where.mesReferencia = filters.mesReferencia;
    }

    return await prisma.projecaoPagamento.findMany({
      where,
      orderBy: [
        { mesReferencia: "desc" },
        { criadoEm: "desc" }
      ],
      include: {
        contrato: {
          select: {
            id: true,
            empresaId: true,
            valorPrincipal: true,
            statusContrato: true,
          }
        }
      }
    });
  }

  static async getById(id: string) {
    return await prisma.projecaoPagamento.findUnique({
      where: { id },
      include: {
        contrato: {
          select: {
            id: true,
            empresaId: true,
            valorPrincipal: true,
            statusContrato: true,
          }
        }
      }
    });
  }

  static async create(data: CreateProjecaoPagamentoInput) {
    return await prisma.projecaoPagamento.create({
      data: {
        contratoId: data.contratoId,
        mesReferencia: data.mesReferencia,
        mrrProjetado: data.mrrProjetado,
        valorProjetado: data.valorProjetado,
        confianca: data.confianca,
        metodoProjecao: data.metodoProjecao,
      },
      include: {
        contrato: {
          select: {
            id: true,
            empresaId: true,
            valorPrincipal: true,
            statusContrato: true,
          }
        }
      }
    });
  }

  static async update(id: string, data: UpdateProjecaoPagamentoInput) {
    return await prisma.projecaoPagamento.update({
      where: { id },
      data: {
        contratoId: data.contratoId,
        mesReferencia: data.mesReferencia,
        mrrProjetado: data.mrrProjetado,
        valorProjetado: data.valorProjetado,
        confianca: data.confianca,
        metodoProjecao: data.metodoProjecao,
      },
      include: {
        contrato: {
          select: {
            id: true,
            empresaId: true,
            valorPrincipal: true,
            statusContrato: true,
          }
        }
      }
    });
  }

  static async delete(id: string) {
    return await prisma.projecaoPagamento.delete({
      where: { id }
    });
  }

  static async getByContratoAndMes(contratoId: string, mesReferencia: Date) {
    return await prisma.projecaoPagamento.findUnique({
      where: {
        contratoId_mesReferencia: {
          contratoId,
          mesReferencia
        }
      },
      include: {
        contrato: {
          select: {
            id: true,
            empresaId: true,
            valorPrincipal: true,
            statusContrato: true,
          }
        }
      }
    });
  }
}