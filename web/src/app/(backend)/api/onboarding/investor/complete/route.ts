import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;

    if (user.userType !== "investor") {
      return Response.json(
        { error: "User is not an investor" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Find existing investor record
    const existingInvestidor = await prisma.investidor.findUnique({
      where: { uidUsuario: user.id },
    });

    if (!existingInvestidor) {
      return Response.json(
        { error: "Investor record not found" },
        { status: 404 }
      );
    }

    // Update investor with onboarding data
    const updatedInvestidor = await prisma.investidor.update({
      where: { uidUsuario: user.id },
      data: {
        tipoPessoa: body.tipo_pessoa || existingInvestidor.tipoPessoa,
        nomeRazaoSocial: body.nome_razao_social || existingInvestidor.nomeRazaoSocial,
        documentoIdentificacao: body.documento_identificacao,
        patrimonioLiquido: body.patrimonio_liquido
          ? parseFloat(body.patrimonio_liquido)
          : null,
        declaracaoRisco: body.declaracao_risco || false,
        experienciaAtivosRisco: body.experiencia_ativos_risco || false,
        modeloInvestimento: body.modelo_investimento || existingInvestidor.modeloInvestimento,
        fonteRecursos: body.fonte_recursos || null,
        statusKyc: "PENDENTE",
      },
    });

    return Response.json(
      {
        message: "Investor onboarding completed successfully",
        data: updatedInvestidor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error completing investor onboarding:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
