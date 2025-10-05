import { parseUpdate } from '../../../schemas/dados-bancarios';
import {
  deleteDadosBancarios,
  getDadosBancarios,
  updateDadosBancarios,
} from '../../../services/dados-bancarios';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const item = await getDadosBancarios({ id });
    if (!item) return json({ error: 'Dados bancários não encontrados' }, { status: 404 });
    
    return json(item);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao buscar dados bancários';
    return json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateDadosBancarios({ id }, data);
    return json(updated);
  } catch (e: any) {
    const msg = e?.issues 
      ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') 
      : (e?.message ?? 'Erro ao atualizar dados bancários');
    const status = e?.issues ? 400 : e?.code === 'P2025' ? 404 : 500;
    return json({ error: msg }, { status });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const deleted = await deleteDadosBancarios({ id });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao excluir dados bancários';
    const status = e?.code === 'P2025' ? 404 : 500;
    return json({ error: msg }, { status });
  }
}