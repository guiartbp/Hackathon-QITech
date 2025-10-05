import { parseCreate, parseUpdate, parseQuery } from '../../schemas/metricas-mensais';
import { 
  createMetricasMensais, 
  deleteMetricasMensais, 
  getMetricasMensais, 
  listMetricasMensais, 
  updateMetricasMensais 
} from '../../services/metricas-mensais';

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export async function GET(req: Request) {
  try {
    const queryParams = parseQuery(req.url);
    const { empresaId, mesReferencia, page, limit, sortBy, sortOrder } = queryParams;

    // Se não há ID específico, lista as métricas
    const skip = ((page || 1) - 1) * (limit || 10);
    const result = await listMetricasMensais({ 
      empresaId, 
      mesReferencia, 
      skip, 
      take: limit,
      sortBy,
      sortOrder
    });
    return json(result);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao buscar métricas mensais');
    const status = e?.issues ? 400 : 500;
    return json({ error: msg }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = parseCreate(body);
    const created = await createMetricasMensais(data);
    return json(created, { status: 201 });
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao criar métricas mensais');
    const status = e?.issues ? 400 : e?.message?.includes('Já existem métricas') ? 409 : e?.message?.includes('Empresa não encontrada') ? 400 : 500;
    return json({ error: msg }, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    const queryParams = parseQuery(req.url);
    if (!queryParams.empresaId && !queryParams.mesReferencia) {
      return json({ error: 'Informe empresaId e mesReferencia para atualizar métricas mensais' }, { status: 400 });
    }

    const body = await req.json();
    const data = parseUpdate(body);

    const updated = await updateMetricasMensais({ 
      empresaId: queryParams.empresaId, 
      mesReferencia: queryParams.mesReferencia 
    }, data);
    return json(updated);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao atualizar métricas mensais');
    const status = e?.issues ? 400 : e?.message?.includes('não encontradas') ? 404 : e?.message?.includes('Já existem métricas') ? 409 : 500;
    return json({ error: msg }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const queryParams = parseQuery(req.url);
    if (!queryParams.empresaId && !queryParams.mesReferencia) {
      return json({ error: 'Informe empresaId e mesReferencia para excluir métricas mensais' }, { status: 400 });
    }

    const deleted = await deleteMetricasMensais({ 
      empresaId: queryParams.empresaId, 
      mesReferencia: queryParams.mesReferencia 
    });
    return json(deleted);
  } catch (e: any) {
    const msg = e?.issues ? e.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ') : (e?.message ?? 'Erro ao excluir métricas mensais');
    const status = e?.issues ? 400 : e?.message?.includes('não encontradas') ? 404 : 500;
    return json({ error: msg }, { status });
  }
}