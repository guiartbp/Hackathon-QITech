import { ZodError } from 'zod';
import { parseCreate, parseQuery, parseUpdate } from '../../schemas/tomador';
import { createTomador, deleteTomador, getTomador, listTomadores, updateTomador } from '../../services/tomador';

function json(data: unknown, init: ResponseInit = {}) {
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
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const msg = e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return json({ error: msg }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : 'Erro ao buscar';
    return json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = parseCreate(body);
    const created = await createTomador(data);
    return json(created, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const msg = e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return json({ error: msg }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : 'Erro ao criar';
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
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const msg = e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return json({ error: msg }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : 'Erro ao atualizar';
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
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const msg = e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return json({ error: msg }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : 'Erro ao excluir';
    return json({ error: msg }, { status: 400 });
  }
}

