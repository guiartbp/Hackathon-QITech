import { DadosBancariosService } from "@/app/(backend)/services/dados-bancarios";
import { DadosBancariosSchema } from "@/app/(backend)/schemas/dados-bancarios";
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
    const dadosBancarios = await DadosBancariosService.buscarPorId(params.id);
    if (!dadosBancarios) {
      return Response.json({ erro: "Dados bancários não encontrados" }, { status: 404 });
    }
    return Response.json(dadosBancarios);
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const dados = DadosBancariosSchema.partial().parse(body);
    const atualizado = await DadosBancariosService.atualizar(params.id, dados);
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
    await DadosBancariosService.remover(params.id);
    return Response.json({ sucesso: true }, { status: 200 });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}