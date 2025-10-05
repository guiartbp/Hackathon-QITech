import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { PropostaWizardSchema } from "@/app/(backend)/schemas/propostas";
import { ZodError } from "zod";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues.map((e: any) => e.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ erro: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    
    // Validar dados do wizard
    const dados = PropostaWizardSchema.parse(body);

    // Buscar empresa do usuário
    const tomador = await prisma.tomador.findUnique({
      where: { uidUsuario: session.user.id },
      include: { empresa: true }
    });

    if (!tomador || !tomador.empresa) {
      return Response.json({ 
        erro: "Empresa não encontrada" 
      }, { status: 404 });
    }

    // Buscar score atual
    const score = await prisma.score.findFirst({
      where: { empresaId: tomador.empresa.id },
      orderBy: { criadoEm: 'desc' }
    });

    // Preparar dados para salvar
    // Usamos campos existentes de forma criativa:
    // - planoUsoFundos: JSON stringificado com proposito, detalhamento, connections
    const planoUsoFundos = JSON.stringify({
      proposito: dados.proposito,
      detalhamento: dados.detalhamento || '',
      connections: dados.connections,
    });

    // Criar proposta
    const proposta = await prisma.proposta.create({
      data: {
        empresaId: tomador.empresa.id,
        valorSolicitado: dados.valorSolicitado,
        multiploCap: dados.multiploCap,
        percentualMrr: dados.percentualMrr,
        duracaoMeses: dados.duracaoMeses || dados.simulation?.projecoes[1]?.prazo_estimado_meses || 12,
        planoUsoFundos: planoUsoFundos,
        statusFunding: "EM_ANALISE",
        scoreNaAbertura: dados.scoreNaAbertura || score?.scoreTotal,
        dataAbertura: new Date(),
        valorFinanciado: 0,
        progressoFunding: 0,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          }
        }
      }
    });

    return Response.json({
      success: true,
      proposta_id: proposta.id,
      status: proposta.statusFunding,
      message: "Proposta criada com sucesso! Aguarde análise.",
    }, { status: 201 });

  } catch (err: unknown) {
    console.error('Erro ao criar proposta:', err);
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ 
      erro: getErrorMessage(err),
      success: false 
    }, { status });
  }
}
