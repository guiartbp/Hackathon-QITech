import { parseCreate, parseUpdate, parseQuery } from '../../schemas/tomador';
import { createTomador, deleteTomador, getTomador, listTomadores, updateTomador } from '../../services/tomador';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request) {
  try {
    const { id, uid_usuario, cnpj, search, skip, take } = parseQuery(req.url);

    if (id || uid_usuario || cnpj) {
      const item = await getTomador({ id, uid_usuario, cnpj });
      if (!item) return json({ error: 'Não encontrado' }, { status: 404 });
      return json(item);
    }

    const items = await listTomadores({ search, skip, take });
    return json(items);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao buscar');
    const status = e?.issues ? 400 : 500;
    return json({ error: msg }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = parseCreate(body);
    const created = await createTomador(data);
    return json(created, { status: 201 });
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao criar');
    return json({ error: msg }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, uid_usuario, cnpj } = parseQuery(req.url);
    if (!id && !uid_usuario && !cnpj) {
      return json({ error: 'Informe id, uid_usuario ou cnpj' }, { status: 400 });
    }

    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateTomador({ id, uid_usuario, cnpj }, data);
    return json(updated);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao atualizar');
    return json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, uid_usuario, cnpj } = parseQuery(req.url);
    if (!id && !uid_usuario && !cnpj) {
      return json({ error: 'Informe id, uid_usuario ou cnpj' }, { status: 400 });
    }

    const deleted = await deleteTomador({ id, uid_usuario, cnpj });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao excluir');
    return json({ error: msg }, { status: 400 });
  }
}
