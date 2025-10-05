import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  adapter: prismaAdapter(prisma, { provider: "postgresql" }),
  database: {
    type: "postgresql",
  },
});
