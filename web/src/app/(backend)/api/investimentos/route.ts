import { InvestimentoService } from "@/app/(backend)/services/investimentos";
import { InvestimentoSchema } from "@/app/(backend)/schemas/investimentos";
import { ZodError } from "zod";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues.map(issue => issue.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function GET() {
  const investimentos = await InvestimentoService.listar();
  return Response.json(investimentos);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = InvestimentoSchema.parse(body);
    const novo = await InvestimentoService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}