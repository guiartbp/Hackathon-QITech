import { parseCreate, parseUpdate, parseQuery } from '../../schemas/investidor';
import {
  createInvestidor,
  deleteInvestidor,
  getInvestidor,
  listInvestidores,
  updateInvestidor,
} from '../../services/investidor';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request) {
  try {
    const { id, uid_usuario, documento_identificacao, search, skip, take } = parseQuery(req.url);

    if (id || uid_usuario || documento_identificacao) {
      const item = await getInvestidor({ id, uid_usuario, documento_identificacao });
      if (!item) return json({ error: 'Não encontrado' }, { status: 404 });
      return json(item);
    }

    const items = await listInvestidores({ search, skip, take });
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
    const created = await createInvestidor(data);
    return json(created, { status: 201 });
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao criar');
    return json({ error: msg }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, uid_usuario, documento_identificacao } = parseQuery(req.url);
    if (!id && !uid_usuario && !documento_identificacao) {
      return json({ error: 'Informe id, uid_usuario ou documento_identificacao' }, { status: 400 });
    }

    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateInvestidor({ id, uid_usuario, documento_identificacao }, data);
    return json(updated);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao atualizar');
    return json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, uid_usuario, documento_identificacao } = parseQuery(req.url);
    if (!id && !uid_usuario && !documento_identificacao) {
      return json({ error: 'Informe id, uid_usuario ou documento_identificacao' }, { status: 400 });
    }

    const deleted = await deleteInvestidor({ id, uid_usuario, documento_identificacao });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao excluir');
    return json({ error: msg }, { status: 400 });
  }
}
