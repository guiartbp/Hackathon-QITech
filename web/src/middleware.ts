import { NextResponse, type NextRequest } from "next/server";
import { shouldBypassAuth } from "@/lib/devConfig";

// ⚠️  ATENÇÃO: CONFIGURAÇÃO TEMPORÁRIA PARA DESENVOLVIMENTO ⚠️
// As rotas user-protected estão temporariamente desprotegidas para facilitar o desenvolvimento
// REMOVER ANTES DE PRODUÇÃO!

const publicRoutes = [
  { path: "/login", whenAuthenticated: 'redirect' },
  { path: "/cadastro", whenAuthenticated: 'redirect' },
  { path: "/register", whenAuthenticated: 'redirect' },
  { path: "/public", whenAuthenticated: 'next' },
  // TEMPORÁRIO: Permitir acesso a user-protected sem login para desenvolvimento
  { path: "/teste", whenAuthenticated: 'next' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => path === route.path);
  const authToken = request.cookies.get('token')

  // TEMPORÁRIO: Verificar se deve bypasse auth para desenvolvimento
  const shouldBypass = shouldBypassAuth(path);

  // Se a autenticação está desabilitada para desenvolvimento, permitir acesso a tudo
  if (shouldBypass) {
    return NextResponse.next();
  }

  // Allow public routes without authentication
  if (!authToken && publicRoute){
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and not a public route
  if (!authToken && !publicRoute) {
    const redirectURL = request.nextUrl.clone();
    redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectURL);
  }

  // Redirect authenticated users from login/cadastro to dashboard
  if (authToken && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectURL = request.nextUrl.clone();
    redirectURL.pathname = '/dashboard';
    return NextResponse.redirect(redirectURL);
  }

  // Check onboarding status for authenticated users accessing onboarding routes
  if (authToken) {
    const isOnboardingRoute =
      path.startsWith('/cadastro/in/') ||
      path.startsWith('/cadastro/to/');

    // If accessing an onboarding route, verify it matches user type
    if (isOnboardingRoute) {
      try {
        const baseUrl = request.nextUrl.origin;
        const response = await fetch(`${baseUrl}/api/onboarding/status`, {
          headers: {
            Cookie: `token=${authToken.value}`,
          },
        });

        if (response.ok) {
          const status = await response.json();

          // If onboarding is complete, redirect to dashboard
          if (status.onboardingComplete) {
            const redirectURL = request.nextUrl.clone();
            redirectURL.pathname = '/dashboard';
            return NextResponse.redirect(redirectURL);
          }

          // Check if user is on the wrong onboarding flow
          const isInvestorRoute = path.startsWith('/cadastro/in/');
          const isFounderRoute = path.startsWith('/cadastro/to/');

          if (status.userType === 'investor' && isFounderRoute) {
            const redirectURL = request.nextUrl.clone();
            redirectURL.pathname = '/cadastro/in/nome';
            return NextResponse.redirect(redirectURL);
          }

          if (status.userType === 'founder' && isInvestorRoute) {
            const redirectURL = request.nextUrl.clone();
            redirectURL.pathname = '/cadastro/to/dados-pessoais';
            return NextResponse.redirect(redirectURL);
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    }

    return NextResponse.next();
  }
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};