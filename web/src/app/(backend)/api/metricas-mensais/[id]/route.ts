import { parseUpdate } from '../../../schemas/metricas-mensais';
import { 
  deleteMetricasMensais, 
  getMetricasMensais, 
  updateMetricasMensais 
} from '../../../services/metricas-mensais';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const item = await getMetricasMensais({ id });
    
    if (!item) {
      return json({ error: 'Métricas mensais não encontradas' }, { status: 404 });
    }
    
    return json(item);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao buscar métricas mensais';
    return json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateMetricasMensais({ id }, data);
    return json(updated);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao atualizar métricas mensais');
    const status = e?.issues ? 400 : e?.message?.includes('não encontradas') ? 404 : e?.message?.includes('Já existem métricas') ? 409 : 500;
    return json({ error: msg }, { status });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deleted = await deleteMetricasMensais({ id });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao excluir métricas mensais';
    const status = e?.message?.includes('não encontradas') ? 404 : 500;
    return json({ error: msg }, { status });
  }
}