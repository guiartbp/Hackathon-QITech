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

export async function GET() {
  const dadosBancarios = await DadosBancariosService.listar();
  return Response.json(dadosBancarios);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = DadosBancariosSchema.parse(body);
    const novo = await DadosBancariosService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}