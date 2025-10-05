import { parseCreate, parseUpdate, parseQuery } from '../../schemas/metricas-tempo-real';
import { 
  createMetricasTempoReal, 
  deleteMetricasTempoReal, 
  getMetricasTempoReal, 
  listMetricasTempoReal, 
  updateMetricasTempoReal 
} from '../../services/metricas-tempo-real';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request) {
  try {
    const { id, empresa_id, timestamp_captura, search, skip, take } = parseQuery(req.url);

    if (id) {
      const item = await getMetricasTempoReal({ id });
      if (!item) return json({ error: 'Métricas de tempo real não encontradas' }, { status: 404 });
      return json(item);
    }

    const result = await listMetricasTempoReal({ 
      empresa_id, 
      timestamp_captura, 
      search, 
      skip, 
      take 
    });
    return json(result);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao buscar métricas de tempo real');
    const status = e?.issues ? 400 : 500;
    return json({ error: msg }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = parseCreate(body);
    const created = await createMetricasTempoReal(data);
    return json(created, { status: 201 });
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao criar métricas de tempo real');
    const status = e?.issues ? 400 : e?.code === 'P2002' ? 409 : e?.code === 'P2003' ? 400 : 500;
    return json({ error: msg }, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = parseQuery(req.url);
    if (!id) {
      return json({ error: 'Informe o id das métricas de tempo real' }, { status: 400 });
    }

    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateMetricasTempoReal({ id }, data);
    return json(updated);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao atualizar métricas de tempo real');
    const status = e?.issues ? 400 : e?.code === 'P2025' ? 404 : e?.code === 'P2002' ? 409 : e?.code === 'P2003' ? 400 : 500;
    return json({ error: msg }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = parseQuery(req.url);
    if (!id) {
      return json({ error: 'Informe o id das métricas de tempo real' }, { status: 400 });
    }

    const deleted = await deleteMetricasTempoReal({ id });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao excluir métricas de tempo real');
    const status = e?.issues ? 400 : e?.code === 'P2025' ? 404 : 500;
    return json({ error: msg }, { status });
  }
}