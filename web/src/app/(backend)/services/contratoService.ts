import { PrismaClient } from "@/generated/prisma";
import { CreateContratoData, UpdateContratoData, ContratoQueryParams } from "../schemas/contrato";

const prisma = new PrismaClient();

export class ContratoService {
  // Criar um novo contrato
  async createContrato(data: CreateContratoData) {
    try {
      const contrato = await prisma.contrato.create({
        data: {
          ...data,
          dataInicio: new Date(data.dataInicio),
          dataFimPrevista: data.dataFimPrevista ? new Date(data.dataFimPrevista) : null,
          dataFimReal: data.dataFimReal ? new Date(data.dataFimReal) : null,
        },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true,
            }
          },
          proposta: {
            select: {
              id: true,
              valorSolicitado: true,
              statusFunding: true,
            }
          },
        },
      });
      return contrato;
    } catch (error) {
      throw new Error(`Erro ao criar contrato: ${error}`);
    }
  }

  // Buscar todos os contratos com filtros opcionais
  async getAllContratos(params: ContratoQueryParams) {
    try {
      const { empresaId, propostaId, statusContrato, page = 1, limit = 20 } = params;
      
      const where: any = {};
      
      if (empresaId) where.empresaId = empresaId;
      if (propostaId) where.propostaId = propostaId;
      if (statusContrato) where.statusContrato = statusContrato;

      const skip = (page - 1) * limit;

      const [contratos, total] = await Promise.all([
        prisma.contrato.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            criadoEm: 'desc'
          },
          include: {
            empresa: {
              select: {
                id: true,
                razaoSocial: true,
                cnpj: true,
              }
            },
            proposta: {
              select: {
                id: true,
                valorSolicitado: true,
                statusFunding: true,
              }
            },
          },
        }),
        prisma.contrato.count({ where })
      ]);

      return {
        data: contratos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erro ao buscar contratos: ${error}`);
    }
  }

  // Buscar contrato por ID
  async getContratoById(id: string) {
    try {
      const contrato = await prisma.contrato.findUnique({
        where: { id },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true,
              nomeFantasia: true,
            }
          },
          proposta: {
            select: {
              id: true,
              valorSolicitado: true,
              statusFunding: true,
              multiploCap: true,
              percentualMrr: true,
            }
          },
          investimentos: {
            select: {
              id: true,
              valorAportado: true,
              percentualParticipacao: true,
              statusInvestimento: true,
              investidor: {
                select: {
                  id: true,
                  nomeRazaoSocial: true,
                }
              }
            }
          },
          pagamentos: {
            select: {
              id: true,
              tipoPagamento: true,
              dataVencimento: true,
              dataPagamento: true,
              valorEsperado: true,
              valorPago: true,
              status: true,
            },
            orderBy: {
              dataVencimento: 'desc'
            }
          },
          projecoesPagamento: {
            select: {
              id: true,
              mesReferencia: true,
              mrrProjetado: true,
              valorProjetado: true,
              confianca: true,
            },
            orderBy: {
              mesReferencia: 'asc'
            }
          }
        },
      });

      if (!contrato) {
        throw new Error("Contrato não encontrado");
      }

      return contrato;
    } catch (error) {
      throw new Error(`Erro ao buscar contrato: ${error}`);
    }
  }

  // Atualizar contrato
  async updateContrato(id: string, data: UpdateContratoData) {
    try {
      // Verificar se contrato existe
      const existingContrato = await prisma.contrato.findUnique({
        where: { id }
      });

      if (!existingContrato) {
        throw new Error("Contrato não encontrado");
      }

      const updateData: any = { ...data };
      
      // Converter strings de data para objetos Date
      if (data.dataInicio) updateData.dataInicio = new Date(data.dataInicio);
      if (data.dataFimPrevista) updateData.dataFimPrevista = new Date(data.dataFimPrevista);
      if (data.dataFimReal) updateData.dataFimReal = new Date(data.dataFimReal);

      const contrato = await prisma.contrato.update({
        where: { id },
        data: updateData,
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true,
            }
          },
          proposta: {
            select: {
              id: true,
              valorSolicitado: true,
              statusFunding: true,
            }
          },
        },
      });

      return contrato;
    } catch (error) {
      throw new Error(`Erro ao atualizar contrato: ${error}`);
    }
  }

  // Deletar contrato
  async deleteContrato(id: string) {
    try {
      // Verificar se contrato existe
      const existingContrato = await prisma.contrato.findUnique({
        where: { id }
      });

      if (!existingContrato) {
        throw new Error("Contrato não encontrado");
      }

      await prisma.contrato.delete({
        where: { id }
      });

      return { message: "Contrato deletado com sucesso" };
    } catch (error) {
      throw new Error(`Erro ao deletar contrato: ${error}`);
    }
  }

  // Buscar contratos por empresa
  async getContratosByEmpresa(empresaId: string) {
    try {
      const contratos = await prisma.contrato.findMany({
        where: { empresaId },
        orderBy: {
          criadoEm: 'desc'
        },
        include: {
          proposta: {
            select: {
              id: true,
              valorSolicitado: true,
              statusFunding: true,
            }
          },
        },
      });

      return contratos;
    } catch (error) {
      throw new Error(`Erro ao buscar contratos da empresa: ${error}`);
    }
  }

  // Buscar contrato por proposta
  async getContratoByProposta(propostaId: string) {
    try {
      const contrato = await prisma.contrato.findUnique({
        where: { propostaId },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true,
            }
          },
          proposta: {
            select: {
              id: true,
              valorSolicitado: true,
              statusFunding: true,
            }
          },
        },
      });

      return contrato;
    } catch (error) {
      throw new Error(`Erro ao buscar contrato por proposta: ${error}`);
    }
  }
}