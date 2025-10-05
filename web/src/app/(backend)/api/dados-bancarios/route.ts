import { parseCreate, parseUpdate, parseQuery } from '../../schemas/dados-bancarios';
import {
  createDadosBancarios,
  deleteDadosBancarios,
  getDadosBancarios,
  listDadosBancarios,
  listDadosBancariosByUser,
  updateDadosBancarios,
} from '../../services/dados-bancarios';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request) {
  try {
    const { id, usuario_id, tipo_usuario, is_principal, search, skip, take } = parseQuery(req.url);

    // Buscar dados bancários específicos por ID
    if (id) {
      const item = await getDadosBancarios({ id });
      if (!item) return json({ error: 'Dados bancários não encontrados' }, { status: 404 });
      return json(item);
    }

    // Buscar dados bancários de um usuário específico
    if (usuario_id && tipo_usuario) {
      const items = await listDadosBancariosByUser({
        usuario_id: usuario_id,
        tipo_usuario
      });
      return json(items);
    }

    // Listar todos os dados bancários com filtros
    const items = await listDadosBancarios({
      search,
      skip,
      take,
      usuario_id,
      tipo_usuario,
      is_principal
    });
    return json(items);
  } catch (e: any) {
    const msg = e?.issues 
      ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') 
      : (e?.message ?? 'Erro ao buscar dados bancários');
    const status = e?.issues ? 400 : 500;
    return json({ error: msg }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = parseCreate(body);
    const created = await createDadosBancarios(data);
    return json(created, { status: 201 });
  } catch (e: any) {
    const msg = e?.issues 
      ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') 
      : (e?.message ?? 'Erro ao criar dados bancários');
    const status = e?.issues ? 400 : 500;
    return json({ error: msg }, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = parseQuery(req.url);
    if (!id) {
      return json({ error: 'Informe o ID dos dados bancários' }, { status: 400 });
    }

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

export async function DELETE(req: Request) {
  try {
    const { id } = parseQuery(req.url);
    if (!id) {
      return json({ error: 'Informe o ID dos dados bancários' }, { status: 400 });
    }

    const deleted = await deleteDadosBancarios({ id });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.message ?? 'Erro ao excluir dados bancários';
    const status = e?.code === 'P2025' ? 404 : 500;
    return json({ error: msg }, { status });
  }
}