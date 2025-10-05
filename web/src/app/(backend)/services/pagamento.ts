import { PrismaClient } from "@/generated/prisma";
import type {
  CreatePagamentoInput,
  UpdatePagamentoInput,
  PagamentoQueryInput,
} from "../schemas/pagamento";

const prisma = new PrismaClient();

export class PagamentoService {
  static async create(data: CreatePagamentoInput) {
    try {
      const pagamento = await prisma.pagamento.create({
        data: {
          contratoId: data.contratoId,
          tipoPagamento: data.tipoPagamento,
          dataVencimento: new Date(data.dataVencimento),
          dataPagamento: data.dataPagamento ? new Date(data.dataPagamento) : null,
          diasAtraso: data.diasAtraso ?? 0,
          mrrPeriodo: data.mrrPeriodo,
          valorEsperado: data.valorEsperado,
          valorPago: data.valorPago,
          valorAcumuladoPago: data.valorAcumuladoPago,
          multiploAtingido: data.multiploAtingido,
          status: data.status ?? "AGENDADO",
          taxaEfetiva: data.taxaEfetiva,
          metodoPagamento: data.metodoPagamento,
        },
        include: {
          contrato: {
            select: {
              id: true,
              empresaId: true,
              valorPrincipal: true,
              statusContrato: true,
            },
          },
          repasses: {
            select: {
              id: true,
              valorRepasse: true,
              status: true,
              investidor: {
                select: {
                  id: true,
                  nomeRazaoSocial: true,
                },
              },
            },
          },
        },
      });

      return pagamento;
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      throw new Error("Falha ao criar pagamento");
    }
  }

  static async findMany(query: PagamentoQueryInput = {}) {
    try {
      const {
        contratoId,
        status,
        tipoPagamento,
        dataVencimentoInicio,
        dataVencimentoFim,
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (contratoId) {
        where.contratoId = contratoId;
      }

      if (status) {
        where.status = status;
      }

      if (tipoPagamento) {
        where.tipoPagamento = tipoPagamento;
      }

      if (dataVencimentoInicio || dataVencimentoFim) {
        where.dataVencimento = {};
        if (dataVencimentoInicio) {
          where.dataVencimento.gte = new Date(dataVencimentoInicio);
        }
        if (dataVencimentoFim) {
          where.dataVencimento.lte = new Date(dataVencimentoFim);
        }
      }

      const skip = (page - 1) * limit;

      const [pagamentos, total] = await Promise.all([
        prisma.pagamento.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            dataVencimento: "desc",
          },
          include: {
            contrato: {
              select: {
                id: true,
                empresaId: true,
                valorPrincipal: true,
                statusContrato: true,
                empresa: {
                  select: {
                    id: true,
                    razaoSocial: true,
                    cnpj: true,
                  },
                },
              },
            },
            repasses: {
              select: {
                id: true,
                valorRepasse: true,
                status: true,
                investidor: {
                  select: {
                    id: true,
                    nomeRazaoSocial: true,
                  },
                },
              },
            },
          },
        }),
        prisma.pagamento.count({ where }),
      ]);

      return {
        pagamentos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
      throw new Error("Falha ao buscar pagamentos");
    }
  }

  static async findById(id: string) {
    try {
      const pagamento = await prisma.pagamento.findUnique({
        where: { id },
        include: {
          contrato: {
            include: {
              empresa: {
                select: {
                  id: true,
                  razaoSocial: true,
                  nomeFantasia: true,
                  cnpj: true,
                },
              },
              proposta: {
                select: {
                  id: true,
                  valorSolicitado: true,
                  multiploCap: true,
                },
              },
            },
          },
          repasses: {
            include: {
              investidor: {
                select: {
                  id: true,
                  nomeRazaoSocial: true,
                  documentoIdentificacao: true,
                },
              },
              investimento: {
                select: {
                  id: true,
                  valorAportado: true,
                  percentualParticipacao: true,
                },
              },
            },
          },
        },
      });

      if (!pagamento) {
        throw new Error("Pagamento não encontrado");
      }

      return pagamento;
    } catch (error) {
      console.error("Erro ao buscar pagamento:", error);
      throw new Error(error instanceof Error ? error.message : "Falha ao buscar pagamento");
    }
  }

  static async update(id: string, data: UpdatePagamentoInput) {
    try {
      // Verificar se o pagamento existe
      const existingPagamento = await prisma.pagamento.findUnique({
        where: { id },
      });

      if (!existingPagamento) {
        throw new Error("Pagamento não encontrado");
      }

      const updateData: any = {};

      if (data.tipoPagamento !== undefined) {
        updateData.tipoPagamento = data.tipoPagamento;
      }
      if (data.dataVencimento !== undefined) {
        updateData.dataVencimento = new Date(data.dataVencimento);
      }
      if (data.dataPagamento !== undefined) {
        updateData.dataPagamento = data.dataPagamento ? new Date(data.dataPagamento) : null;
      }
      if (data.diasAtraso !== undefined) {
        updateData.diasAtraso = data.diasAtraso;
      }
      if (data.mrrPeriodo !== undefined) {
        updateData.mrrPeriodo = data.mrrPeriodo;
      }
      if (data.valorEsperado !== undefined) {
        updateData.valorEsperado = data.valorEsperado;
      }
      if (data.valorPago !== undefined) {
        updateData.valorPago = data.valorPago;
      }
      if (data.valorAcumuladoPago !== undefined) {
        updateData.valorAcumuladoPago = data.valorAcumuladoPago;
      }
      if (data.multiploAtingido !== undefined) {
        updateData.multiploAtingido = data.multiploAtingido;
      }
      if (data.status !== undefined) {
        updateData.status = data.status;
      }
      if (data.taxaEfetiva !== undefined) {
        updateData.taxaEfetiva = data.taxaEfetiva;
      }
      if (data.metodoPagamento !== undefined) {
        updateData.metodoPagamento = data.metodoPagamento;
      }

      const pagamento = await prisma.pagamento.update({
        where: { id },
        data: updateData,
        include: {
          contrato: {
            select: {
              id: true,
              empresaId: true,
              valorPrincipal: true,
              statusContrato: true,
            },
          },
          repasses: {
            select: {
              id: true,
              valorRepasse: true,
              status: true,
              investidor: {
                select: {
                  id: true,
                  nomeRazaoSocial: true,
                },
              },
            },
          },
        },
      });

      return pagamento;
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error);
      throw new Error(error instanceof Error ? error.message : "Falha ao atualizar pagamento");
    }
  }

  static async delete(id: string) {
    try {
      // Verificar se o pagamento existe
      const existingPagamento = await prisma.pagamento.findUnique({
        where: { id },
        include: {
          repasses: true,
        },
      });

      if (!existingPagamento) {
        throw new Error("Pagamento não encontrado");
      }

      // Verificar se há repasses associados
      if (existingPagamento.repasses.length > 0) {
        throw new Error("Não é possível excluir pagamento com repasses associados");
      }

      await prisma.pagamento.delete({
        where: { id },
      });

      return { message: "Pagamento excluído com sucesso" };
    } catch (error) {
      console.error("Erro ao excluir pagamento:", error);
      throw new Error(error instanceof Error ? error.message : "Falha ao excluir pagamento");
    }
  }

  static async getStatistics(contratoId?: string) {
    try {
      const where: any = {};
      if (contratoId) {
        where.contratoId = contratoId;
      }

      const [
        totalPagamentos,
        pagamentosAgendados,
        pagamentosRealizados,
        pagamentosAtrasados,
        valorTotalEsperado,
        valorTotalPago,
      ] = await Promise.all([
        prisma.pagamento.count({ where }),
        prisma.pagamento.count({
          where: {
            ...where,
            status: "AGENDADO",
          },
        }),
        prisma.pagamento.count({
          where: {
            ...where,
            status: "PAGO",
          },
        }),
        prisma.pagamento.count({
          where: {
            ...where,
            diasAtraso: { gt: 0 },
          },
        }),
        prisma.pagamento.aggregate({
          where,
          _sum: {
            valorEsperado: true,
          },
        }),
        prisma.pagamento.aggregate({
          where: {
            ...where,
            valorPago: { not: null },
          },
          _sum: {
            valorPago: true,
          },
        }),
      ]);

      return {
        totalPagamentos,
        pagamentosAgendados,
        pagamentosRealizados,
        pagamentosAtrasados,
        valorTotalEsperado: valorTotalEsperado._sum.valorEsperado || 0,
        valorTotalPago: valorTotalPago._sum.valorPago || 0,
        percentualPago: valorTotalEsperado._sum.valorEsperado
          ? ((Number(valorTotalPago._sum.valorPago) || 0) / Number(valorTotalEsperado._sum.valorEsperado)) * 100
          : 0,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas de pagamentos:", error);
      throw new Error("Falha ao buscar estatísticas de pagamentos");
    }
  }
}