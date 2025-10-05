import { MrrPorPlanoService } from "@/app/(backend)/services/mrr-por-plano";
import { MrrPorPlanoSchema } from "@/app/(backend)/schemas/mrr-por-plano";
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
  const mrrs = await MrrPorPlanoService.listar();
  return Response.json(mrrs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = MrrPorPlanoSchema.parse(body);
    const novo = await MrrPorPlanoService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}