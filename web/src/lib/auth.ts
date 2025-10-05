import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";

// Singleton pattern for Prisma client to avoid multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      userType: {
        type: "string",
        required: false,
        input: true, // Allow this field to be set during signup
      },
    },
  },
  async onAfterSignUp(user: any) {
    // Create corresponding Investidor or Tomador record based on userType
    if (user.userType === "investor") {
      // Will need to be completed with additional investor data later
      await prisma.investidor.create({
        data: {
          uidUsuario: user.id,
          tipoPessoa: "PF", // Default, can be updated later
          documentoIdentificacao: "", // Placeholder, to be filled during onboarding
          nomeRazaoSocial: user.name,
          modeloInvestimento: "DIRETO", // Default
        },
      }).catch(err => {
        console.error("Error creating Investidor record:", err);
      });
    } else if (user.userType === "founder") {
      await prisma.tomador.create({
        data: {
          uidUsuario: user.id,
          nomeCompleto: user.name,
          email: user.email,
        },
      }).catch(err => {
        console.error("Error creating Tomador record:", err);
      });
    }
  },
});
