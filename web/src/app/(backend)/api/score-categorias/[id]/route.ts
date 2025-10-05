import { ScoreCategoriaService } from "@/app/(backend)/services/score-categorias";
import { ScoreCategoriaSchema } from "@/app/(backend)/schemas/score-categorias";
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
  const { id } = await params;
  const scoreCategoria = await ScoreCategoriaService.buscarPorId(id);
  if (!scoreCategoria) {
    return Response.json({ erro: "Score categoria não encontrada" }, { status: 404 });
  }
  return Response.json(scoreCategoria);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const dados = ScoreCategoriaSchema.parse(body);
    const atualizado = await ScoreCategoriaService.atualizar(id, dados);
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
    const { id } = await params;
    await ScoreCategoriaService.remover(id);
    return Response.json({ sucesso: true });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}