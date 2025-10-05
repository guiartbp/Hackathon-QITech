import { getAllUsers, findUserByEmail } from "../../services/users";
import { registerSchema } from "../../schemas";
import { ZodError } from "zod";
import { auth } from "@/auth";

function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues.map(e => e.message).join("; ");
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Erro desconhecido";
}

export async function GET() {
  const users = await getAllUsers();
  return Response.json(users);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dados = registerSchema.parse(body);
    
    const { name, email, password } = dados;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return Response.json(
        { 
          erro: "Usuário já existe",
          field: "email" 
        },
        { status: 409 }
      );
    }    
    
    const user = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: "/",
      }
    });

    return Response.json(user, { status: 201 });
  } catch (err: unknown) {
    const status = err instanceof ZodError ? 422 : 400;
    return Response.json({ erro: getErrorMessage(err) }, { status });
  }
}