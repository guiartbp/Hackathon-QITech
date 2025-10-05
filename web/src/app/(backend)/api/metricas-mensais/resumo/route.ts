import { getResumoMetricas } from '../../../services/metricas-mensais';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const empresaId = searchParams.get('empresaId') || undefined;
    
    const resumo = await getResumoMetricas(empresaId);
    return json(resumo);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao buscar resumo das métricas mensais';
    return json({ error: msg }, { status: 500 });
  }
}