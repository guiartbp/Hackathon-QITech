"use client";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { FilterButton } from '@/components/marketplace/FilterButton';
import { PropostaCard } from '@/components/marketplace/PropostaCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Filter, Loader2 } from 'lucide-react';
import { usePropostas, type MarketplaceFilters } from '@/hooks/usePropostas';

export default function Marketplace() {
  const navigate = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    adequado: false,
    tier: false,
    producao: false,
    highProgress: false,
    lowRisk: false,
  });

  // Build marketplace filters from state
  const marketplaceFilters: MarketplaceFilters = useMemo(() => {
    const apiFilters: MarketplaceFilters = {};

    if (searchQuery) {
      apiFilters.search = searchQuery;
    }

    // Score filter removed - show all scores

    if (filters.tier) {
      apiFilters.tier = 'A'; // Tier A+B
    }

    if (filters.producao) {
      apiFilters.statusFunding = 'ATIVA'; // Status em produção
    }

    if (filters.highProgress) {
      apiFilters.progressoFundingMin = 75; // Progresso alto > 75%
    }

    if (filters.lowRisk) {
      apiFilters.scoreMin = 85; // Baixo risco > 85 pontos
    }

    return apiFilters;
  }, [searchQuery, filters]);

  const { propostas, loading, error } = usePropostas(marketplaceFilters);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setFilters({ adequado: false, tier: false, producao: false, highProgress: false, lowRisk: false });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || searchQuery;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Marketplace de Tomadores</h1>
            <p className="text-muted-foreground mb-6">
              Explore oportunidades de investimento em empresas SaaS verificadas
            </p>
            <SearchBar 
              placeholder="Buscar por empresa, setor ou métrica..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          
          {/* Filters Bar */}
          <Card className="mb-6 p-4">
            <div className="flex gap-3 items-center flex-wrap">
              <Filter className="w-5 h-5 text-muted-foreground" />
              
              <FilterButton 
                label="Adequado" 
                active={filters.adequado}
                onToggle={() => toggleFilter('adequado')}
              />
              
              <FilterButton 
                label="Tier A+B" 
                active={filters.tier}
                onToggle={() => toggleFilter('tier')}
              />
              
              <FilterButton
                label="Produção"
                active={filters.producao}
                onToggle={() => toggleFilter('producao')}
              />

              <FilterButton
                label="Alto Funding"
                active={filters.highProgress}
                onToggle={() => toggleFilter('highProgress')}
              />

              <FilterButton
                label="Baixo Risco"
                active={filters.lowRisk}
                onToggle={() => toggleFilter('lowRisk')}
              />
              
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </Card>
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Carregando propostas...</h3>
              <p className="text-muted-foreground">
                Buscando as melhores oportunidades para você
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Erro ao carregar propostas</h3>
              <p className="text-muted-foreground mb-4">
                {error}
              </p>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Grid of Proposals */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propostas.map(proposta => (
                <PropostaCard
                  key={proposta.id}
                  proposta={proposta}
                  onClick={() => navigate.push(`/in/propostas/${proposta.id}`)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && propostas.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Nenhuma proposta encontrada</h3>
              <p className="text-muted-foreground">
                Ajuste seus filtros ou volte mais tarde
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
