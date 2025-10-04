"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/format';

// Funções auxiliares
function calcularDiasRestantes(dataStr: string): number {
  const hoje = new Date();
  const dataTarget = new Date(dataStr);
  const diffTime = dataTarget.getTime() - hoje.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Interfaces TypeScript
interface PropostaAberta {
  id: string;
  diasAberta: number;
  totalDivida: number;
  rendimento: number;
  duracao: number;
  progressoFunding: number;
  valorFinanciado: number;
  valorRestante: number;
}

interface ContratoDivida {
  id: string;
  proposta_id: string;
  valor_total: number;
  multiplo_cap: number;
  valor_pago: number;
  percentual_pago: number;
  proximo_pagamento?: {
    data: string;
    valor: number;
    dias_restantes: number;
  };
  status: 'ativo' | 'quitado';
}

// Mock Data
const mockPropostaAberta: PropostaAberta | null = {
  id: '2024-10-CRM',
  diasAberta: 2,
  totalDivida: 500000,
  rendimento: 21,
  duracao: 18,
  progressoFunding: 69,
  valorFinanciado: 345000,
  valorRestante: 155000
};

const mockContratos: ContratoDivida[] = [
  {
    id: '1',
    proposta_id: '2024-10-CRM',
    valor_total: 80000,
    multiplo_cap: 1.32,
    valor_pago: 47500,
    percentual_pago: 45,
    proximo_pagamento: {
      data: '2024-11-28',
      valor: 5100,
      dias_restantes: 18
    },
    status: 'ativo'
  },
  {
    id: '2',
    proposta_id: '2024-09-MKT',
    valor_total: 80000,
    multiplo_cap: 1.32,
    valor_pago: 105600,
    percentual_pago: 100,
    status: 'quitado'
  },
  {
    id: '3',
    proposta_id: '2024-08-EXP',
    valor_total: 120000,
    multiplo_cap: 1.25,
    valor_pago: 89000,
    percentual_pago: 59,
    proximo_pagamento: {
      data: '2024-12-15',
      valor: 7200,
      dias_restantes: 35
    },
    status: 'ativo'
  }
];

export default function MinhasDividas() {
  const [propostaAberta, setPropostaAberta] = useState<PropostaAberta | null>(mockPropostaAberta);
  const [contratos, setContratos] = useState<ContratoDivida[]>(mockContratos);
  const [tabAtiva, setTabAtiva] = useState('todos');
  const navigate = useRouter();

  // Filtrar contratos por tab
  const contratosFiltrados = contratos.filter(c => {
    if (tabAtiva === 'todos') return true;
    if (tabAtiva === 'ativos') return c.status === 'ativo';
    if (tabAtiva === 'quitados') return c.status === 'quitado';
    return true;
  });

  const getBadgeVariant = (status: string) => {
    if (status === 'ativo') return 'default';
    if (status === 'quitado') return 'secondary';
    return 'outline';
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold text-white mb-2">Minhas Dívidas</h1>
          <p className="text-muted-foreground mb-8">
            Acompanhe suas solicitações de crédito e contratos ativos
          </p>

          {/* Card de Proposta em Funding - Condicional */}
          {propostaAberta && (
            <Card className="mb-6 bg-warning/10 border-2 border-warning">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">💡</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      Sua proposta está aberta...
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Proposta #{propostaAberta.id} | Solicitada há {propostaAberta.diasAberta} dias
                    </p>
                    
                    {/* Grid de Informações */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total da dívida:</p>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(propostaAberta.totalDivida)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Rendimento:</p>
                        <p className="text-xl font-bold text-info">
                          {propostaAberta.rendimento}% a.a.
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duração:</p>
                        <p className="text-xl font-bold">
                          {propostaAberta.duracao} meses
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          Progresso do Funding
                        </span>
                        <span className="font-semibold text-warning text-lg">
                          {propostaAberta.progressoFunding}%
                        </span>
                      </div>
                      <Progress 
                        value={propostaAberta.progressoFunding} 
                        className="h-3 mb-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-warning">
                          {formatCurrency(propostaAberta.valorFinanciado)}
                        </span>
                        <span className="text-muted-foreground">
                          / {formatCurrency(propostaAberta.totalDivida)}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                    >
                      Ativar com {formatCurrency(propostaAberta.valorRestante)}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card "Precisando de mais dinheiro?" */}
          <Card className="mb-6 border-2 hover:border-primary transition-colors">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💰</span>
                  <p className="text-lg font-semibold">
                    Precisando de mais dinheiro?
                  </p>
                </div>
                <Button 
                  className="bg-warning hover:bg-warning/90 text-warning-foreground"
                  onClick={() => navigate.push('/to/solicitar-credito')}
                >
                  Solicitar crédito
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Filtro */}
          <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
              <TabsTrigger value="quitados">Quitados</TabsTrigger>
            </TabsList>

            <TabsContent value={tabAtiva} className="mt-6">
              {/* Grid de Contratos */}
              {contratosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {contratosFiltrados.map(contrato => (
                    <Card 
                      key={contrato.id}
                      className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
                      onClick={() => navigate.push(`/to/contrato/${contrato.id}`)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Proposta #{contrato.proposta_id}
                            </p>
                            <Badge variant={getBadgeVariant(contrato.status)}>
                              {contrato.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Métricas em Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Empréstimo</p>
                            <p className="font-semibold text-primary">
                              {formatCurrency(contrato.valor_total)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Cap</p>
                            <p className="font-semibold">
                              {contrato.multiplo_cap}x 
                              <span className="text-sm text-muted-foreground ml-1">
                                ({formatCurrency(contrato.valor_total * contrato.multiplo_cap)})
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Você pagou</p>
                            <p className="font-semibold text-success">
                              {formatCurrency(contrato.valor_pago)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Falta</p>
                            <p className="font-semibold text-warning">
                              {formatCurrency(
                                (contrato.valor_total * contrato.multiplo_cap) - contrato.valor_pago
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Próximo Pagamento (se ativo) */}
                        {contrato.status === 'ativo' && contrato.proximo_pagamento && (
                          <div className={`rounded-lg p-3 border ${
                            calcularDiasRestantes(contrato.proximo_pagamento.data) <= 7 
                              ? 'bg-warning/10 border-warning/20' 
                              : 'bg-info/10 border-info/20'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs text-muted-foreground">
                                Próximo pagamento
                              </p>
                              {calcularDiasRestantes(contrato.proximo_pagamento.data) <= 7 && (
                                <span className="text-xs">⚠️</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className={`font-semibold ${
                                calcularDiasRestantes(contrato.proximo_pagamento.data) <= 7 
                                  ? 'text-warning' 
                                  : 'text-info'
                              }`}>
                                {formatCurrency(contrato.proximo_pagamento.valor)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                em {formatDate(contrato.proximo_pagamento.data)} 
                                ({calcularDiasRestantes(contrato.proximo_pagamento.data)} dias)
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className={`font-semibold ${
                              contrato.percentual_pago === 100 
                                ? 'text-success' 
                                : contrato.percentual_pago > 75 
                                ? 'text-warning' 
                                : 'text-primary'
                            }`}>
                              {contrato.percentual_pago}%
                            </span>
                          </div>
                          <Progress 
                            value={contrato.percentual_pago} 
                            className="h-2"
                          />
                        </div>
                      </CardContent>

                      <CardFooter className="pt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                        >
                          Ver contrato →
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Nenhum contrato encontrado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Você ainda não possui empréstimos nesta categoria
                  </p>
                  <Button onClick={() => navigate.push('/to/solicitar-credito')}>
                    Solicitar primeiro crédito
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}