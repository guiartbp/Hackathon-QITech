import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;

    // Check if user has a userType
    if (!user.userType) {
      return Response.json({
        onboardingComplete: false,
        userType: null,
        nextStep: "/cadastro"
      });
    }

    // Check onboarding status based on userType
    if (user.userType === "investor") {
      const investidor = await prisma.investidor.findUnique({
        where: { uidUsuario: user.id }
      });

      if (!investidor) {
        return Response.json({
          onboardingComplete: false,
          userType: "investor",
          nextStep: "/cadastro/in/nome"
        });
      }

      // Check if all required fields are filled
      const isComplete =
        investidor.documentoIdentificacao &&
        investidor.documentoIdentificacao.length > 0 &&
        investidor.declaracaoRisco === true;

      return Response.json({
        onboardingComplete: isComplete,
        userType: "investor",
        nextStep: isComplete ? "/dashboard" : "/cadastro/in/nome",
        data: investidor
      });
    } else if (user.userType === "founder") {
      const tomador = await prisma.tomador.findUnique({
        where: { uidUsuario: user.id },
        include: { empresa: true }
      });

      if (!tomador) {
        return Response.json({
          onboardingComplete: false,
          userType: "founder",
          nextStep: "/cadastro/to/dados-pessoais"
        });
      }

      // Check if empresa exists and has required fields
      const isComplete =
        tomador.empresa !== null &&
        tomador.empresa.cnpj &&
        tomador.empresa.cnpj.length > 0;

      return Response.json({
        onboardingComplete: isComplete,
        userType: "founder",
        nextStep: isComplete ? "/dashboard" : "/cadastro/to/dados-pessoais",
        data: { tomador, empresa: tomador.empresa }
      });
    }

    return Response.json({
      onboardingComplete: false,
      userType: user.userType,
      nextStep: "/cadastro"
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
