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

export async function GET() {
  const metricasMensais = await MetricasMensaisService.listar();
  return Response.json(metricasMensais);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = MetricasMensaisSchema.parse(body);
    const novo = await MetricasMensaisService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}