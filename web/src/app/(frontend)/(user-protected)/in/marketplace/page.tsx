"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { FilterButton } from '@/components/marketplace/FilterButton';
import { PropostaCard } from '@/components/marketplace/PropostaCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { mockPropostas } from '@/lib/mockData';

export default function Marketplace() {
  const navigate = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    adequado: true,
    tier: false,
    producao: false,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setFilters({ adequado: false, tier: false, producao: false });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || searchQuery;

  const filteredPropostas = mockPropostas.filter(proposta => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return proposta.nome.toLowerCase().includes(query) || 
             proposta.scoreLabel.toLowerCase().includes(query);
    }
    return true;
  });

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
          
          {/* Grid of Proposals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPropostas.map(proposta => (
              <PropostaCard
                key={proposta.id}
                proposta={proposta}
                onClick={() => navigate.push(`/propostadetalhes/${proposta.id}`)}
              />
            ))}
          </div>
          
          {/* Empty State */}
          {filteredPropostas.length === 0 && (
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
