import { getLatestMetricasTempoRealPorEmpresa } from '../../../../../services/metricas-tempo-real';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request, { params }: { params: { empresaId: string } }) {
  try {
    const { empresaId } = params;
    
    const result = await getLatestMetricasTempoRealPorEmpresa(empresaId);
    
    if (!result) {
      return json({ error: 'Nenhuma métrica encontrada para esta empresa' }, { status: 404 });
    }

    return json(result);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao buscar última métrica de tempo real da empresa';
    return json({ error: msg }, { status: 500 });
  }
}