import { z } from "zod";

// Schema para validação de email
export const emailSchema = z
  .string()
  .email("Por favor, insira um email válido")
  .min(1, "Email é obrigatório");

// Schema para validação de senha
export const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/\d/, "A senha deve conter pelo menos um número");

// Schema para validação de ID (UUID)
export const idSchema = z
  .string()
  .uuid("ID deve ser um UUID válido");

// Schema para atualização de senha
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: passwordSchema,
});

// Schema para confirmação de senha
export const confirmPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// Schema para registro de usuário
export const registerUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
});

// Schema para login de usuário
export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Senha é obrigatória"),
});