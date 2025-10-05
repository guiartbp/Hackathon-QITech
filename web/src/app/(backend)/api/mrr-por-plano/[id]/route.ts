import { MrrPorPlanoService } from "@/app/(backend)/services/mrr-por-plano";
import { MrrPorPlanoSchema } from "@/app/(backend)/schemas/mrr-por-plano";
import { ZodError } from "zod";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.errors.map(e => e.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mrrPlano = await MrrPorPlanoService.buscarPorId(params.id);
  if (!mrrPlano) {
    return Response.json({ erro: "MRR por plano não encontrado" }, { status: 404 });
  }
  return Response.json(mrrPlano);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const dados = MrrPorPlanoSchema.parse(body);
    const atualizado = await MrrPorPlanoService.atualizar(params.id, dados);
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
    await MrrPorPlanoService.remover(params.id);
    return new Response(null, { status: 204 });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}
