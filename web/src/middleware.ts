import { NextResponse, type NextRequest } from "next/server";
import { shouldBypassAuth } from "@/lib/devConfig";

// ⚠️  ATENÇÃO: CONFIGURAÇÃO TEMPORÁRIA PARA DESENVOLVIMENTO ⚠️
// As rotas user-protected estão temporariamente desprotegidas para facilitar o desenvolvimento
// REMOVER ANTES DE PRODUÇÃO!

const publicRoutes = [
  { path: "/login", whenAuthenticated: 'redirect' },
  { path: "/register", whenAuthenticated: 'redirect' },
  { path: "/public", whenAuthenticated: 'next' },
  // TEMPORÁRIO: Permitir acesso a user-protected sem login para desenvolvimento
  { path: "/in", whenAuthenticated: 'next' },
  { path: "/teste", whenAuthenticated: 'next' },
  { path: "/to", whenAuthenticated: 'next' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.cookies.get('token')
  
  // TEMPORÁRIO: Verificar se deve bypasse auth para desenvolvimento
  const shouldBypass = shouldBypassAuth(path);
  
  // Se a autenticação está desabilitada para desenvolvimento, permitir acesso a tudo
  if (shouldBypass) {
    return NextResponse.next();
  }
  
  if (!authToken && publicRoute){
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectURL = request.nextUrl.clone();

    redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED; 

    return NextResponse.redirect(redirectURL);
  }

  if (authToken && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectURL = request.nextUrl.clone();

    redirectURL.pathname = '/'; 

    return NextResponse.redirect(redirectURL);
  }

  if (authToken && !publicRoute) {
    return NextResponse.next();
  } 
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};