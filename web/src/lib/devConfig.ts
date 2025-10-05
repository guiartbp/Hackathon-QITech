// ⚠️ CONFIGURAÇÃO TEMPORÁRIA PARA DESENVOLVIMENTO ⚠️
// Este arquivo controla se as rotas protegidas devem ser acessíveis sem login
// REMOVER ANTES DE PRODUÇÃO!

export const DEV_CONFIG = {
  // Desabilitar autenticação para desenvolvimento
  DISABLE_AUTH: true,
  
  // Rotas que devem ser acessíveis mesmo sem login durante desenvolvimento
  BYPASS_AUTH_ROUTES: [
    '/',
    '/in',
    '/teste', 
    '/to',
    '/dashboard'
  ],
  
  // Prefixos de rotas que devem ser acessíveis
  BYPASS_AUTH_PREFIXES: [
    '/in/',
    '/teste/',
    '/to/',
    '/dashboard/',
    '/cadastro/'
  ]
};

// Helper function para verificar se uma rota deve ser bypassed
export function shouldBypassAuth(path: string): boolean {
  if (!DEV_CONFIG.DISABLE_AUTH) return false;
  
  // Durante desenvolvimento, permitir acesso a TODAS as rotas exceto login/register
  if (DEV_CONFIG.DISABLE_AUTH) {
    // Ainda bloquear login/register se já autenticado (para evitar loops)
    const authRestrictedRoutes = ['/login', '/register'];
    return !authRestrictedRoutes.includes(path);
  }
  
  // Verificar rotas exatas
  if (DEV_CONFIG.BYPASS_AUTH_ROUTES.includes(path)) return true;
  
  // Verificar prefixos
  return DEV_CONFIG.BYPASS_AUTH_PREFIXES.some(prefix => path.startsWith(prefix));
}