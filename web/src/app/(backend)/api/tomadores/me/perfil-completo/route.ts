import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ erro: "Não autenticado" }, { status: 401 });
    }

    // Buscar tomador e empresa
    const tomador = await prisma.tomador.findUnique({
      where: { uidUsuario: session.user.id },
      include: {
        empresa: {
          include: {
            metricasTempoReal: {
              orderBy: { timestampCaptura: 'desc' },
              take: 1
            },
            scores: {
              orderBy: { criadoEm: 'desc' },
              take: 1
            },
            metricasMensais: {
              orderBy: { mesReferencia: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    if (!tomador || !tomador.empresa) {
      return Response.json({ 
        erro: "Empresa não encontrada. Complete seu onboarding primeiro." 
      }, { status: 404 });
    }

    const empresa = tomador.empresa;
    const metricas = empresa.metricasTempoReal[0];
    const score = empresa.scores[0];
    const metricasMensais = empresa.metricasMensais[0];

    // Calcular limite máximo baseado no MRR
    const mrrAtual = metricas?.mrr ? Number(metricas.mrr) : 
                     metricasMensais?.mrrFinal ? Number(metricasMensais.mrrFinal) : 0;
    
    // Limite máximo: 6x o MRR anual (MRR * 12 * 0.5)
    const limiteMaximo = Math.floor(mrrAtual * 12 * 0.5);

    // Score atual (750 é um valor padrão médio-alto)
    const scoreAtual = score?.scoreTotal || 750;

    // Crescimento MRR mensal médio (em %)
    const crescimentoMrrMensal = metricasMensais?.expansionPct ? 
      Number(metricasMensais.expansionPct) : 2.1;

    // Percentual do MRR oferecido como pagamento (baseado no score)
    let percentualMrr = 4.2; // padrão
    if (scoreAtual >= 800) percentualMrr = 3.5;
    else if (scoreAtual >= 700) percentualMrr = 4.2;
    else if (scoreAtual >= 600) percentualMrr = 5.0;
    else percentualMrr = 6.0;

    // Múltiplo cap (baseado no score e risco)
    let multiplicoCap = 1.28; // padrão
    if (scoreAtual >= 800) multiplicoCap = 1.20;
    else if (scoreAtual >= 700) multiplicoCap = 1.28;
    else if (scoreAtual >= 600) multiplicoCap = 1.35;
    else multiplicoCap = 1.45;

    return Response.json({
      limite_maximo: limiteMaximo,
      score: scoreAtual,
      mrr_atual: mrrAtual,
      crescimento_mrr_mensal: crescimentoMrrMensal,
      percentual_mrr_ofertado: percentualMrr,
      multiplo_cap: multiplicoCap,
      tier: score?.tier || "GROWTH",
      empresa_id: empresa.id,
      empresa_nome: empresa.razaoSocial,
    });

  } catch (error) {
    console.error('Erro ao buscar perfil completo:', error);
    return Response.json({ 
      erro: "Erro ao buscar perfil do tomador" 
    }, { status: 500 });
  }
}
