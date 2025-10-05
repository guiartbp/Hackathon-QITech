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

export async function GET() {
  const metricas = await MetricasTempoRealService.listar();
  return Response.json(metricas);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = MetricasTempoRealSchema.parse(body);
    const novo = await MetricasTempoRealService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}