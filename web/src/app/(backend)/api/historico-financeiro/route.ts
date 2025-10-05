import { HistoricoFinanceiroService } from "@/app/(backend)/services/historico-financeiro";
import { HistoricoFinanceiroSchema } from "@/app/(backend)/schemas/historico-financeiro";
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
  const historicoFinanceiro = await HistoricoFinanceiroService.listar();
  return Response.json(historicoFinanceiro);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = HistoricoFinanceiroSchema.parse(body);
    const novo = await HistoricoFinanceiroService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}