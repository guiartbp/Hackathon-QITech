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

    if (user.userType !== "founder") {
      return Response.json(
        { error: "User is not a founder" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Find existing tomador record
    const existingTomador = await prisma.tomador.findUnique({
      where: { uidUsuario: user.id },
      include: { empresa: true },
    });

    if (!existingTomador) {
      return Response.json(
        { error: "Tomador record not found" },
        { status: 404 }
      );
    }

    // Update tomador with personal data
    const updatedTomador = await prisma.tomador.update({
      where: { uidUsuario: user.id },
      data: {
        nomeCompleto: body.nome_completo || existingTomador.nomeCompleto,
        email: body.email || existingTomador.email,
        cargo: body.cargo || null,
        statusCompliance: "PENDENTE",
      },
    });

    // Create or update empresa record
    let empresa;
    if (existingTomador.empresa) {
      empresa = await prisma.empresa.update({
        where: { id: existingTomador.empresa.id },
        data: {
          cnpj: body.cnpj,
          razaoSocial: body.razao_social,
          nomeFantasia: body.nome_fantasia || null,
          website: body.website || null,
          segmento: body.segmento || null,
          setor: body.setor || null,
          estagioInvestimento: body.estagio_investimento || null,
          descricaoCurta: body.descricao_curta || null,
          descricaoCompleta: body.descricao_completa || null,
          produto: body.produto || null,
          dataFundacao: body.data_fundacao ? new Date(body.data_fundacao) : null,
          numeroFuncionarios: body.numero_funcionarios || null,
          emoji: body.emoji || null,
        },
      });
    } else {
      empresa = await prisma.empresa.create({
        data: {
          tomadorId: existingTomador.id,
          cnpj: body.cnpj,
          razaoSocial: body.razao_social,
          nomeFantasia: body.nome_fantasia || null,
          website: body.website || null,
          segmento: body.segmento || null,
          setor: body.setor || null,
          estagioInvestimento: body.estagio_investimento || null,
          descricaoCurta: body.descricao_curta || null,
          descricaoCompleta: body.descricao_completa || null,
          produto: body.produto || null,
          dataFundacao: body.data_fundacao ? new Date(body.data_fundacao) : null,
          numeroFuncionarios: body.numero_funcionarios || null,
          emoji: body.emoji || null,
        },
      });
    }

    return Response.json(
      {
        message: "Founder onboarding completed successfully",
        data: { tomador: updatedTomador, empresa },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error completing founder onboarding:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
