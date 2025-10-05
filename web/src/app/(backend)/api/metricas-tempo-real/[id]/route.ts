import { parseUpdate } from '../../../schemas/metricas-tempo-real';
import { 
  deleteMetricasTempoReal, 
  getMetricasTempoReal, 
  updateMetricasTempoReal 
} from '../../../services/metricas-tempo-real';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const item = await getMetricasTempoReal({ id });
    
    if (!item) {
      return json({ error: 'Métricas de tempo real não encontradas' }, { status: 404 });
    }
    
    return json(item);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao buscar métricas de tempo real';
    return json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deleted = await deleteMetricasTempoReal({ id });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao excluir métricas de tempo real';
    const status = e?.code === 'P2025' ? 404 : 500;
    return json({ error: msg }, { status });
  }
}