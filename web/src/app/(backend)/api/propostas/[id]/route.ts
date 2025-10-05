import { PropostaService } from "@/app/(backend)/services/propostas";
import { PropostaSchema } from "@/app/(backend)/schemas/propostas";
import { ZodError } from "zod";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues.map((e: any) => e.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const proposta = await PropostaService.buscarPorId(id);
    if (!proposta) {
      return Response.json({ erro: "Proposta não encontrada" }, { status: 404 });
    }
    return Response.json(proposta);
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const dados = PropostaSchema.partial().parse(body);
    const atualizado = await PropostaService.atualizar(id, dados);
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
    await PropostaService.remover(id);
    return Response.json({ sucesso: true }, { status: 200 });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}