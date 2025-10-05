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
    const { id, uid_usuario, email, search, skip, take } = parseQuery(req.url);

    if (id || uid_usuario || email) {
      const item = await getTomador({ id, uid_usuario });
      if (!item) return json({ error: 'Tomador não encontrado' }, { status: 404 });
      return json(item);
    }

    const items = await listTomadores({ search, skip, take });
    return json(items);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao buscar tomadores');
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
    const { id, uid_usuario } = parseQuery(req.url);
    if (!id && !uid_usuario) {
      return json({ error: 'Informe id ou uid_usuario' }, { status: 400 });
    }

    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateTomador({ id, uid_usuario }, data);
    return json(updated);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao atualizar tomador');
    const status = e?.issues ? 400 : e?.code === 'P2025' ? 404 : 500;
    return json({ error: msg }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, uid_usuario } = parseQuery(req.url);
    if (!id && !uid_usuario) {
      return json({ error: 'Informe id ou uid_usuario' }, { status: 400 });
    }

    const deleted = await deleteTomador({ id, uid_usuario });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao excluir tomador');
    const status = e?.issues ? 400 : e?.code === 'P2025' ? 404 : 500;
    return json({ error: msg }, { status });
  }
}
