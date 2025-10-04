"use client";

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Wallet, Settings, ChevronDown, ChevronRight, CreditCard, BarChart3, Building, User } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(
    pathname.startsWith('/in/portfolio')
  );

  // Detectar se é tomador (páginas /to/) ou investidor
  const isTomador = pathname.startsWith('/to/');

  // Navegação para Investidor
  const navItemsInvestidor = [
    { href: '/in/marketplace', label: 'Marketplace', icon: Home },
    { href: '/in/saldo', label: 'Meu Saldo', icon: Wallet },
    { href: '/in/config', label: 'Configurações', icon: Settings },
  ];

  const portfolioSubItems = [
    { href: '/in/portfolio/evolucao', label: 'Evolução' },
    { href: '/in/portfolio/pagamentos', label: 'Pagamentos' },
  ];

  // Navegação para Tomador
  const navItemsTomador = [
    { href: '/to/minhas_dividas', label: 'Minhas Dívidas', icon: CreditCard },
    { href: '/to/meus_pagamentos', label: 'Meus Pagamentos', icon: Wallet },
    { href: '/to/meu_score', label: 'Meu Score', icon: BarChart3 },
    { href: '/to/meu_negocio', label: 'Meu Negócio', icon: Building },
    { href: '/to/configuracoes', label: 'Configurações', icon: Settings },
    { href: '/to/meu_perfil', label: 'Meu Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0 flex flex-col">
        <div className="p-6">
          <Link href="/in/marketplace" className="flex items-center gap-3 mb-6">
            <img 
              src="/logo-will.png" 
              alt="Will Lending Logo" 
              className="w-12 h-10"
            />
            <span className="text-2xl font-bold text-white text-sidebar-foreground tracking-tight">
              will.lending
            </span>
          </Link>

          {/* User Profile at top */}
          <div className="bg-sidebar-accent rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                HR
              </div>
              <div>
                <p className="font-medium text-sm">Henrique Romano</p>
                <p className="text-xs text-muted-foreground">
                  {isTomador ? 'Tomador' : 'Investidor'}
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {isTomador ? (
              /* Navegação do Tomador */
              <>
                {navItemsTomador.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            ) : (
              /* Navegação do Investidor */
              <>
                {/* Marketplace */}
                <Link
                  href="/in/marketplace"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    pathname.startsWith('/in/marketplace')
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Marketplace</span>
                </Link>
                
                {/* Portfolio Section with Sub-menu */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsPortfolioExpanded(!isPortfolioExpanded)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                      pathname.startsWith('/in/portfolio')
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5" />
                      <span>Portfolio</span>
                    </div>
                    {isPortfolioExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isPortfolioExpanded && (
                    <div className="ml-4 space-y-1">
                      {portfolioSubItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                              isSubActive
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full bg-current opacity-40" />
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Meu Saldo */}
                <Link
                  href="/in/saldo"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    pathname.startsWith('/saldo')
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span>Meu Saldo</span>
                </Link>

                {/* Configurações */}
                <Link
                  href="/in/config"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    pathname.startsWith('/config')
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Configurações</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}