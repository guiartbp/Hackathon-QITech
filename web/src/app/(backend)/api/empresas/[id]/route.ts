import { parseUpdate } from '../../../schemas/empresa';
import {
  deleteEmpresa,
  getEmpresa,
  updateEmpresa,
  getEmpresaWithMetrics,
} from '../../../services/empresa';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const url = new URL(req.url);
    const withMetrics = url.searchParams.get('with_metrics') === 'true';
    
    let item;
    if (withMetrics) {
      item = await getEmpresaWithMetrics(id);
    } else {
      item = await getEmpresa({ id });
    }
    
    if (!item) return json({ error: 'Empresa não encontrada' }, { status: 404 });
    
    return json(item);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao buscar empresa';
    return json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateEmpresa({ id }, data);
    return json(updated);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao atualizar empresa');
    const status = e?.issues ? 400 : e?.code === 'P2025' ? 404 : e?.code === 'P2002' ? 409 : 500;
    return json({ error: msg }, { status });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const deleted = await deleteEmpresa({ id });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao excluir empresa';
    const status = e?.code === 'P2025' ? 404 : 500;
    return json({ error: msg }, { status });
  }
}