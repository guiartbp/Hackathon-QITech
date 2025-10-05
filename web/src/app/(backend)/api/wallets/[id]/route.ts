import { WalletService } from "@/app/(backend)/services/wallets";
import { WalletSchema } from "@/app/(backend)/schemas/wallets";
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
    const wallet = await WalletService.buscarPorId(params.id);
    if (!wallet) {
      return Response.json({ erro: "Carteira não encontrada" }, { status: 404 });
    }
    return Response.json(wallet);
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
    const dados = WalletSchema.partial().parse(body);
    const atualizado = await WalletService.atualizar(params.id, dados);
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
    await WalletService.remover(params.id);
    return Response.json({ sucesso: true }, { status: 200 });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}