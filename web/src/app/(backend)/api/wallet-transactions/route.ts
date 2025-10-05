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

export async function GET() {
  const transactions = await WalletTransactionService.listar();
  return Response.json(transactions);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = WalletTransactionSchema.parse(body);
    const novo = await WalletTransactionService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}