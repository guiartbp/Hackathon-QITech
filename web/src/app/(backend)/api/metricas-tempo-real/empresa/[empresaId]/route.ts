import { parseQuery } from '../../../../schemas/metricas-tempo-real';
import { getMetricasTempoRealPorEmpresa, getLatestMetricasTempoRealPorEmpresa } from '../../../../services/metricas-tempo-real';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request, { params }: { params: { empresaId: string } }) {
  try {
    const { empresaId } = params;
    const { timestamp_captura, skip, take } = parseQuery(req.url);

    const result = await getMetricasTempoRealPorEmpresa(empresaId, {
      timestamp_captura,
      skip,
      take,
    });

    return json(result);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao buscar métricas de tempo real da empresa');
    const status = e?.issues ? 400 : 500;
    return json({ error: msg }, { status });
  }
}