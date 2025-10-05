import { EmpresaService } from "@/app/(backend)/services/empresas";
import { EmpresaSchema } from "@/app/(backend)/schemas/empresas";
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
  const empresas = await EmpresaService.listar();
  return Response.json(empresas);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = EmpresaSchema.parse(body);
    const novo = await EmpresaService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}