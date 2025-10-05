import { MetricasMensaisService } from "@/app/(backend)/services/metricas-mensais";
import { MetricasMensaisSchema } from "@/app/(backend)/schemas/metricas-mensais";
import { ZodError } from "zod";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.errors.map(e => e.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const metrica = await MetricasMensaisService.buscarPorId(params.id);
  if (!metrica) {
    return Response.json({ erro: "Métrica mensal não encontrada" }, { status: 404 });
  }
  return Response.json(metrica);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const dados = MetricasMensaisSchema.parse(body);
    const atualizado = await MetricasMensaisService.atualizar(params.id, dados);
    return Response.json(atualizado);
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await MetricasMensaisService.remover(params.id);
    return new Response(null, { status: 204 });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}