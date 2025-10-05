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
    const { id, uid_usuario, email, search, skip, take } = parseQuery(req.url);

    if (id || uid_usuario || email) {
      const item = await getTomador({ id, uid_usuario });
      if (!item) return json({ error: 'Tomador não encontrado' }, { status: 404 });
      return json(item);
    }

    const items = await listTomadores({ search, skip, take });
    return json(items);
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const msg = e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return json({ error: msg }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : 'Erro ao buscar tomadores';
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
    const { id, uid_usuario } = parseQuery(req.url);
    if (!id && !uid_usuario) {
      return json({ error: 'Informe id ou uid_usuario' }, { status: 400 });
    }

    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateTomador({ id, uid_usuario }, data);
    return json(updated);
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const msg = e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return json({ error: msg }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : 'Erro ao atualizar tomador';
    return json({ error: msg }, { status: 500 });
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
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const msg = e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return json({ error: msg }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : 'Erro ao excluir tomador';
    return json({ error: msg }, { status: 500 });
  }
}

