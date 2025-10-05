import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ erro: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { valor_solicitado } = body;

    if (!valor_solicitado || valor_solicitado <= 0) {
      return Response.json({ 
        erro: "Valor solicitado inválido" 
      }, { status: 400 });
    }

    // Buscar dados do tomador
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
        erro: "Empresa não encontrada" 
      }, { status: 404 });
    }

    const empresa = tomador.empresa;
    const metricas = empresa.metricasTempoReal[0];
    const score = empresa.scores[0];
    const metricasMensais = empresa.metricasMensais[0];

    // MRR atual
    const mrrAtual = metricas?.mrr ? Number(metricas.mrr) : 
                     metricasMensais?.mrrFinal ? Number(metricasMensais.mrrFinal) : 85000;

    // Score atual
    const scoreAtual = score?.scoreTotal || 750;

    // Percentual do MRR (baseado no score)
    let percentualMrr = 4.2;
    if (scoreAtual >= 800) percentualMrr = 3.5;
    else if (scoreAtual >= 700) percentualMrr = 4.2;
    else if (scoreAtual >= 600) percentualMrr = 5.0;
    else percentualMrr = 6.0;

    // Múltiplo cap (baseado no score)
    let multiplicoCap = 1.28;
    if (scoreAtual >= 800) multiplicoCap = 1.20;
    else if (scoreAtual >= 700) multiplicoCap = 1.28;
    else if (scoreAtual >= 600) multiplicoCap = 1.35;
    else multiplicoCap = 1.45;

    const valorTotalRetorno = valor_solicitado * multiplicoCap;
    const custoTotal = valorTotalRetorno - valor_solicitado;

    // Gerar projeções para 3 cenários
    const cenarios = [
      { nome: 'conservador', crescimento: 0.5 }, // 0.5% MRR growth per month
      { nome: 'base', crescimento: 2.0 },        // 2% MRR growth per month  
      { nome: 'otimista', crescimento: 4.0 }     // 4% MRR growth per month
    ];

    const projecoes = cenarios.map(cenario => {
      const cronograma = [];
      let mrrProjetado = mrrAtual;
      let acumuladoPago = 0;
      let mes = 0;
      const hoje = new Date();

      while (acumuladoPago < valorTotalRetorno && mes < 120) { // max 10 anos
        mes++;
        
        // Aplicar crescimento do MRR
        mrrProjetado = mrrProjetado * (1 + cenario.crescimento / 100);
        
        // Calcular parcela (% do MRR)
        const valorParcela = mrrProjetado * (percentualMrr / 100);
        
        // Calcular acumulado
        const novoAcumulado = Math.min(acumuladoPago + valorParcela, valorTotalRetorno);
        const parcelaEfetiva = novoAcumulado - acumuladoPago;
        acumuladoPago = novoAcumulado;
        
        const saldoRestante = valorTotalRetorno - acumuladoPago;
        
        // Data da parcela
        const dataParcela = new Date(hoje);
        dataParcela.setMonth(dataParcela.getMonth() + mes);
        
        cronograma.push({
          mes,
          data: dataParcela.toISOString().split('T')[0],
          mrr_projetado: Math.round(mrrProjetado),
          valor_parcela: Math.round(parcelaEfetiva),
          acumulado_pago: Math.round(acumuladoPago),
          saldo_restante: Math.round(saldoRestante)
        });
        
        // Se pagou tudo, parar
        if (acumuladoPago >= valorTotalRetorno) break;
      }

      return {
        cenario: cenario.nome,
        crescimento_mrr_mensal: cenario.crescimento,
        prazo_estimado_meses: cronograma.length,
        cronograma
      };
    });

    // Data da primeira parcela (próximo mês)
    const primeiraParcela = new Date();
    primeiraParcela.setMonth(primeiraParcela.getMonth() + 1);

    const simulacao = {
      valor_solicitado,
      multiplo_cap: multiplicoCap,
      percentual_mrr: percentualMrr,
      mrr_atual: mrrAtual,
      valor_total_retorno: Math.round(valorTotalRetorno),
      custo_total: Math.round(custoTotal),
      primeira_parcela: primeiraParcela.toISOString().split('T')[0],
      projecoes
    };

    return Response.json(simulacao);

  } catch (error) {
    console.error('Erro ao gerar simulação:', error);
    return Response.json({ 
      erro: "Erro ao gerar simulação" 
    }, { status: 500 });
  }
}
