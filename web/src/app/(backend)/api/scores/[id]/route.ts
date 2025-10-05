import { ScoreService } from "@/app/(backend)/services/scores";
import { ScoreSchema } from "@/app/(backend)/schemas/scores";
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
  const score = await ScoreService.buscarPorId(params.id);
  if (!score) {
    return Response.json({ erro: "Score não encontrado" }, { status: 404 });
  }
  return Response.json(score);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const dados = ScoreSchema.parse(body);
    const atualizado = await ScoreService.atualizar(params.id, dados);
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
    await ScoreService.remover(params.id);
    return Response.json({ sucesso: true });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}