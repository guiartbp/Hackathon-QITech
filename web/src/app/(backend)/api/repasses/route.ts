import { RepasseService } from "@/app/(backend)/services/repasses";
import { RepasseSchema } from "@/app/(backend)/schemas/repasses";
import { ZodError } from "zod";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues.map(issue => issue.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function GET() {
  const repasses = await RepasseService.listar();
  return Response.json(repasses);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = RepasseSchema.parse(body);
    const novo = await RepasseService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}