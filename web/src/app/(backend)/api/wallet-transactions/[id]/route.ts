import { WalletTransactionService } from "@/app/(backend)/services/wallet-transactions";
import { WalletTransactionSchema } from "@/app/(backend)/schemas/wallet-transactions";
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
    const transaction = await WalletTransactionService.buscarPorId(params.id);
    if (!transaction) {
      return Response.json({ erro: "Transação não encontrada" }, { status: 404 });
    }
    return Response.json(transaction);
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
    const dados = WalletTransactionSchema.partial().parse(body);
    const atualizado = await WalletTransactionService.atualizar(params.id, dados);
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
    await WalletTransactionService.remover(params.id);
    return Response.json({ sucesso: true }, { status: 200 });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}