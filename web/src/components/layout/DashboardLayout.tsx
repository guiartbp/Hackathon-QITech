"use client";

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Wallet, Settings, ChevronDown, ChevronRight } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(
    pathname.startsWith('/portfolio')
  );

  const navItems = [
    { href: '/marketplace', label: 'Marketplace', icon: Home },
    { href: '/saldo', label: 'Meu Saldo', icon: Wallet },
    { href: '/config', label: 'Configurações', icon: Settings },
  ];

  const portfolioSubItems = [
    { href: '/portfolio/evolucao', label: 'Evolução' },
    { href: '/portfolio/pagamentos', label: 'Pagamentos' },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0 flex flex-col">
        <div className="p-6">
          <Link href="/marketplace" className="flex items-center gap-3 mb-6">
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
                <p className="text-xs text-muted-foreground">Investidor</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {/* Marketplace */}
            <Link
              href="/marketplace"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname.startsWith('/marketplace')
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
                  pathname.startsWith('/portfolio')
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
              href="/saldo"
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
              href="/config"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname.startsWith('/config')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </Link>
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