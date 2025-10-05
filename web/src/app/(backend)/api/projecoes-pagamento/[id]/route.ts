import { ProjecaoPagamentoService } from "@/app/(backend)/services/projecoes-pagamento";
import { ProjecaoPagamentoSchema } from "@/app/(backend)/schemas/projecoes-pagamento";
import { ZodError } from "zod";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues.map(issue => issue.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const projecaoPagamento = await ProjecaoPagamentoService.buscarPorId(params.id);
  if (!projecaoPagamento) {
    return Response.json({ erro: "Projeção de pagamento não encontrada" }, { status: 404 });
  }
  return Response.json(projecaoPagamento);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const dados = ProjecaoPagamentoSchema.parse(body);
    const atualizado = await ProjecaoPagamentoService.atualizar(params.id, dados);
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
    await ProjecaoPagamentoService.remover(params.id);
    return Response.json({ sucesso: true });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}