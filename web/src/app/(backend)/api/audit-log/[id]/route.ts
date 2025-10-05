import { AuditLogService } from "@/app/(backend)/services/audit-log";
import { AuditLogSchema } from "@/app/(backend)/schemas/audit-log";
import { ZodError } from "zod";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues.map(issue => issue.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auditLog = await AuditLogService.buscarPorId(params.id);
  if (!auditLog) {
    return Response.json({ erro: "Audit log não encontrado" }, { status: 404 });
  }
  return Response.json(auditLog);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const dados = AuditLogSchema.parse(body);
    const atualizado = await AuditLogService.atualizar(params.id, dados);
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
    await AuditLogService.remover(params.id);
    return Response.json({ sucesso: true });
  } catch (err: unknown) {
    return Response.json({ erro: getErrorMessage(err) }, { status: 400 });
  }
}