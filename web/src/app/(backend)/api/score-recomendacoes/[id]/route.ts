import { ScoreRecomendacaoService } from "@/app/(backend)/services/score-recomendacoes";
import { ScoreRecomendacaoSchema } from "@/app/(backend)/schemas/score-recomendacoes";
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
  const scoreRecomendacao = await ScoreRecomendacaoService.buscarPorId(params.id);
  if (!scoreRecomendacao) {
    return Response.json({ erro: "Score recomendação não encontrada" }, { status: 404 });
  }
  return Response.json(scoreRecomendacao);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const dados = ScoreRecomendacaoSchema.parse(body);
    const atualizado = await ScoreRecomendacaoService.atualizar(params.id, dados);
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
    await ScoreRecomendacaoService.remover(params.id);
    return Response.json({ sucesso: true });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}