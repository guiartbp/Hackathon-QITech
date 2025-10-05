import { TopClientesService } from "@/app/(backend)/services/top-clientes";
import { TopClientesSchema } from "@/app/(backend)/schemas/top-clientes";
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
  const clientes = await TopClientesService.listar();
  return Response.json(clientes);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = TopClientesSchema.parse(body);
    const novo = await TopClientesService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}