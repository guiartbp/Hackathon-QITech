import { PrismaClient } from '@/generated/prisma';
import type {
  CreateTopClientesInput,
  UpdateTopClientesInput,
  TopClientesQueryParams,
} from '@/app/(backend)/schemas/top-clientes';

const prisma = new PrismaClient();

export class TopClientesService {
  // Criar novo TopClientes
  static async create(data: CreateTopClientesInput) {
    return prisma.topClientes.create({
      data: {
        empresaId: data.empresaId,
        mesReferencia: data.mesReferencia,
        clienteNome: data.clienteNome,
        clienteEmoji: data.clienteEmoji,
        plano: data.plano,
        mrrCliente: data.mrrCliente,
        percentualMrrTotal: data.percentualMrrTotal,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
    });
  }

  // Buscar todos os TopClientes com filtros opcionais
  static async findMany(params: TopClientesQueryParams = {}) {
    const {
      empresaId,
      mesReferencia,
      clienteNome,
      plano,
      page = 1,
      limit = 10,
    } = params;

    const where: any = {};

    if (empresaId) {
      where.empresaId = empresaId;
    }

    if (mesReferencia) {
      where.mesReferencia = new Date(mesReferencia);
    }

    if (clienteNome) {
      where.clienteNome = {
        contains: clienteNome,
        mode: 'insensitive',
      };
    }

    if (plano) {
      where.plano = {
        contains: plano,
        mode: 'insensitive',
      };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.topClientes.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { mesReferencia: 'desc' },
          { mrrCliente: 'desc' },
        ],
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              nomeFantasia: true,
            },
          },
        },
      }),
      prisma.topClientes.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  // Buscar TopClientes por ID
  static async findById(id: string) {
    return prisma.topClientes.findUnique({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          },
        },
      },
    });
  }

  // Atualizar TopClientes
  static async update(id: string, data: UpdateTopClientesInput) {
    return prisma.topClientes.update({
      where: { id },
      data: {
        mesReferencia: data.mesReferencia,
        clienteNome: data.clienteNome,
        clienteEmoji: data.clienteEmoji,
        plano: data.plano,
        mrrCliente: data.mrrCliente,
        percentualMrrTotal: data.percentualMrrTotal,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
    });
  }

  // Deletar TopClientes
  static async delete(id: string) {
    return prisma.topClientes.delete({
      where: { id },
    });
  }

  // Verificar se TopClientes existe
  static async exists(id: string) {
    const count = await prisma.topClientes.count({
      where: { id },
    });
    return count > 0;
  }

  // Buscar por empresa e mês (útil para validações)
  static async findByEmpresaAndMes(empresaId: string, mesReferencia: Date) {
    return prisma.topClientes.findMany({
      where: {
        empresaId,
        mesReferencia,
      },
      orderBy: {
        mrrCliente: 'desc',
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
    });
  }

  // Estatísticas agregadas por empresa
  static async getStatsByEmpresa(empresaId: string) {
    const stats = await prisma.topClientes.aggregate({
      where: { empresaId },
      _sum: {
        mrrCliente: true,
        percentualMrrTotal: true,
      },
      _avg: {
        mrrCliente: true,
        percentualMrrTotal: true,
      },
      _count: {
        id: true,
      },
    });

    return stats;
  }
}