import { parseCreate, parseUpdate, parseQuery } from '../../schemas/empresa';
import { createEmpresa, deleteEmpresa, getEmpresa, listEmpresas, updateEmpresa } from '../../services/empresa';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request) {
  try {
    const { id, tomador_id, cnpj, search, skip, take } = parseQuery(req.url);

    if (id || tomador_id || cnpj) {
      const item = await getEmpresa({ id, tomador_id, cnpj });
      if (!item) return json({ error: 'Empresa não encontrada' }, { status: 404 });
      return json(item);
    }

    const items = await listEmpresas({ search, skip, take });
    return json(items);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao buscar empresas');
    const status = e?.issues ? 400 : 500;
    return json({ error: msg }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = parseCreate(body);
    const created = await createEmpresa(data);
    return json(created, { status: 201 });
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao criar empresa');
    const status = e?.issues ? 400 : e?.code === 'P2002' ? 409 : 500;
    return json({ error: msg }, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, tomador_id, cnpj } = parseQuery(req.url);
    if (!id && !tomador_id && !cnpj) {
      return json({ error: 'Informe id, tomador_id ou cnpj' }, { status: 400 });
    }

    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateEmpresa({ id, tomador_id, cnpj }, data);
    return json(updated);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao atualizar empresa');
    const status = e?.issues ? 400 : e?.code === 'P2025' ? 404 : e?.code === 'P2002' ? 409 : 500;
    return json({ error: msg }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, tomador_id, cnpj } = parseQuery(req.url);
    if (!id && !tomador_id && !cnpj) {
      return json({ error: 'Informe id, tomador_id ou cnpj' }, { status: 400 });
    }

    const deleted = await deleteEmpresa({ id, tomador_id, cnpj });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao excluir empresa');
    const status = e?.issues ? 400 : e?.code === 'P2025' ? 404 : 500;
    return json({ error: msg }, { status });
  }
}