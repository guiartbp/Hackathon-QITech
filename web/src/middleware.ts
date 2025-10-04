import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";

const publicRoutes = [
  { path: "/login", whenAuthenticated: 'redirect' },
  { path: "/register", whenAuthenticated: 'redirect' },
  { path: "/public", whenAuthenticated: 'next' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.cookies.get('token')
  
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