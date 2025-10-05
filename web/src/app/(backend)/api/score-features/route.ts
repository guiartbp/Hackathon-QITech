import { ScoreFeatureService } from "@/app/(backend)/services/score-features";
import { ScoreFeatureSchema } from "@/app/(backend)/schemas/score-features";
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
  const scoreFeatures = await ScoreFeatureService.listar();
  return Response.json(scoreFeatures);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = ScoreFeatureSchema.parse(body);
    const novo = await ScoreFeatureService.criar(dados);
    return Response.json(novo, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}