import { MetricasTempoRealService } from "@/app/(backend)/services/metricas-tempo-real";
import { MetricasTempoRealSchema } from "@/app/(backend)/schemas/metricas-tempo-real";
import { ZodError } from "zod";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues.map((e: any) => e.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const metrica = await MetricasTempoRealService.buscarPorId(params.id);
  if (!metrica) {
    return Response.json({ erro: "Métrica não encontrada" }, { status: 404 });
  }
  return Response.json(metrica);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const dados = MetricasTempoRealSchema.parse(body);
    const atualizado = await MetricasTempoRealService.atualizar(params.id, dados);
    return Response.json(atualizado);
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await MetricasTempoRealService.remover(params.id);
    return Response.json({ sucesso: true });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}