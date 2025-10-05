"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { formatCurrency, formatDate } from '@/lib/format';

// Interfaces TypeScript
interface Pagamento {
  id: string;
  contrato_id: string;
  contrato_nome: string;
  data_vencimento?: string; // para próximos
  data_pagamento?: string; // para histórico
  valor: number;
  mrr_periodo: number;
  taxa_efetiva: number;
  status: 'AGENDADO' | 'PAGO' | 'ATRASADO' | 'PROJETADO';
  diasRestantes?: number; // para próximos
}

interface ProjecaoMensal {
  mes: string;
  valor: number;
}

// Função auxiliar para calcular dias restantes
function calcularDiasRestantes(dataStr: string): number {
  const hoje = new Date();
  const dataTarget = new Date(dataStr);
  const diffTime = dataTarget.getTime() - hoje.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Função para determinar status baseado na data
function determinarStatusPagamento(dataVencimento: string): 'AGENDADO' | 'PROJETADO' {
  const hoje = new Date();
  const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate());
  const dataVenc = new Date(dataVencimento);
  
  return dataVenc <= proximoMes ? 'AGENDADO' : 'PROJETADO';
}

// Mock Data - Próximo Pagamento Destacado
const mockProximoPagamento: Pagamento = {
  id: '1',
  contrato_id: '1',
  contrato_nome: 'Empréstimo #2024-10-CRM',
  data_vencimento: '2024-11-28',
  valor: 5100,
  mrr_periodo: 150000,
  taxa_efetiva: 3.4,
  status: 'AGENDADO',
  diasRestantes: 18
};

// Mock Data - Próximos Pagamentos
const mockPagamentosProximosBase: Omit<Pagamento, 'status'>[] = [
  {
    id: '1',
    contrato_id: '1',
    contrato_nome: 'Empréstimo #2024-10-CRM',
    data_vencimento: '2024-11-28',
    valor: 5100,
    mrr_periodo: 150000,
    taxa_efetiva: 3.4,
    diasRestantes: 18
  },
  {
    id: '2',
    contrato_id: '2',
    contrato_nome: 'Empréstimo #2024-09-MKT',
    data_vencimento: '2024-12-05',
    valor: 3200,
    mrr_periodo: 95000,
    taxa_efetiva: 3.2,
    diasRestantes: 25
  },
  {
    id: '3',
    contrato_id: '3',
    contrato_nome: 'Empréstimo #2024-08-EXP',
    data_vencimento: '2024-12-15',
    valor: 7200,
    mrr_periodo: 210000,
    taxa_efetiva: 3.5,
    diasRestantes: 35
  }
];

// Aplicar status dinâmico
const mockPagamentosProximos: Pagamento[] = mockPagamentosProximosBase.map(pagamento => ({
  ...pagamento,
  status: determinarStatusPagamento(pagamento.data_vencimento!)
}));

// Mock Data - Histórico de Pagamentos
const mockPagamentosHistorico: Pagamento[] = [
  {
    id: '10',
    contrato_id: '1',
    contrato_nome: 'Empréstimo #2024-10-CRM',
    data_pagamento: '2024-10-28',
    valor: 5042,
    mrr_periodo: 148000,
    taxa_efetiva: 3.4,
    status: 'PAGO'
  },
  {
    id: '11',
    contrato_id: '2',
    contrato_nome: 'Empréstimo #2024-09-MKT',
    data_pagamento: '2024-10-22',
    valor: 3150,
    mrr_periodo: 93000,
    taxa_efetiva: 3.2,
    status: 'ATRASADO'
  },
  {
    id: '12',
    contrato_id: '3',
    contrato_nome: 'Empréstimo #2024-08-EXP',
    data_pagamento: '2024-09-28',
    valor: 7100,
    mrr_periodo: 205000,
    taxa_efetiva: 3.5,
    status: 'PAGO'
  },
  {
    id: '13',
    contrato_id: '1',
    contrato_nome: 'Empréstimo #2024-10-CRM',
    data_pagamento: '2024-09-28',
    valor: 4980,
    mrr_periodo: 145000,
    taxa_efetiva: 3.4,
    status: 'PAGO'
  },
  {
    id: '14',
    contrato_id: '2',
    contrato_nome: 'Empréstimo #2024-09-MKT',
    data_pagamento: '2024-09-22',
    valor: 3100,
    mrr_periodo: 91000,
    taxa_efetiva: 3.2,
    status: 'PAGO'
  }
];

// Mock Data - Projeção
const mockProjecaoData: ProjecaoMensal[] = [
  { mes: 'Nov/24', valor: 8300 },
  { mes: 'Dez/24', valor: 8450 },
  { mes: 'Jan/25', valor: 8600 },
  { mes: 'Fev/25', valor: 8200 },
  { mes: 'Mar/25', valor: 5100 },
  { mes: 'Abr/25', valor: 3200 },
  { mes: 'Mai/25', valor: 7200 },
  { mes: 'Jun/25', valor: 5800 },
  { mes: 'Jul/25', valor: 4200 },
  { mes: 'Ago/25', valor: 3800 },
  { mes: 'Set/25', valor: 2100 },
  { mes: 'Out/25', valor: 1500 }
];

// Mock Data - Histórico Mensal
const mockHistoricoData: ProjecaoMensal[] = [
  { mes: 'Abr/24', valor: 10200 },
  { mes: 'Mai/24', valor: 10500 },
  { mes: 'Jun/24', valor: 9800 },
  { mes: 'Jul/24', valor: 11200 },
  { mes: 'Ago/24', valor: 10900 },
  { mes: 'Set/24', valor: 15250 },
  { mes: 'Out/24', valor: 13292 }
];

export default function MeusPagamentos() {
  const navigate = useRouter();
  const [periodoProjecao, setPeriodoProjecao] = useState<'6m' | '12m'>('6m');
  const [dataInicio, setDataInicio] = useState('2024-04-01');
  const [dataFim, setDataFim] = useState('2024-10-31');
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState<'asc' | 'desc'>('desc');

  // Filtrar dados baseado no período selecionado
  const projecaoData = periodoProjecao === '6m' 
    ? mockProjecaoData.slice(0, 6) 
    : mockProjecaoData;

  const pagamentosHistoricoFiltrados = mockPagamentosHistorico
    .filter(p => {
      if (!mesSelecionado) return true;
      const pagamentoMes = new Date(p.data_pagamento!).toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: '2-digit' 
      });
      return pagamentoMes === mesSelecionado;
    })
    .sort((a, b) => {
      const dataA = new Date(a.data_pagamento!);
      const dataB = new Date(b.data_pagamento!);
      return ordenacao === 'desc' 
        ? dataB.getTime() - dataA.getTime()
        : dataA.getTime() - dataB.getTime();
    });

  const aplicarFiltro = () => {
    // Limpar seleção de mês ao aplicar filtro de data
    setMesSelecionado(null);
    // Em uma implementação real, aqui filtraríamos os dados baseado nas datas
    console.log('Filtrar de', dataInicio, 'até', dataFim);
  };

  const getBadgeVariant = (status: string) => {
    if (status === 'PAGO') return 'default';
    if (status === 'AGENDADO') return 'secondary';
    if (status === 'PROJETADO') return 'outline';
    if (status === 'ATRASADO') return 'destructive';
    return 'outline';
  };

  const getBadgeClass = (status: string) => {
    if (status === 'PAGO') return 'bg-success text-success-foreground';
    if (status === 'AGENDADO') return 'bg-warning/10 text-warning border-warning';
    if (status === 'PROJETADO') return 'bg-info/10 text-info border-info';
    if (status === 'ATRASADO') return '';
    return '';
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold text-white mb-2">Meus Pagamentos</h1>
          <p className="text-muted-foreground mb-8">
            Acompanhe o histórico de parcelas pagas e próximos vencimentos
          </p>

          {/* Tabs Principais */}
          <Tabs defaultValue="proximos" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="proximos">Próximos</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            {/* Tab: Próximos Pagamentos */}
            <TabsContent value="proximos">
              {/* Card Resumo do Próximo Pagamento (Destacado) */}
              <Card className="mb-6 bg-warning/10 border-2 border-warning">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Próximo vencimento
                      </p>
                      <p className="text-4xl font-bold text-warning mb-2">
                        {formatCurrency(mockProximoPagamento.valor)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vence em {formatDate(mockProximoPagamento.data_vencimento!)} 
                        ({calcularDiasRestantes(mockProximoPagamento.data_vencimento!)} dias)
                      </p>
                    </div>
                    <Button size="lg" className="bg-warning hover:bg-warning/90 text-warning-foreground">
                      Pagar agora
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Projeção */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Pagamentos Projetados</CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        variant={periodoProjecao === '6m' ? 'secondary' : 'ghost'} 
                        size="sm"
                        onClick={() => setPeriodoProjecao('6m')}
                      >
                        6 meses
                      </Button>
                      <Button 
                        variant={periodoProjecao === '12m' ? 'secondary' : 'ghost'} 
                        size="sm"
                        onClick={() => setPeriodoProjecao('12m')}
                      >
                        12 meses
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projecaoData}>
                      <XAxis 
                        dataKey="mes" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))' 
                        }}
                      />
                      <Bar 
                        dataKey="valor" 
                        fill="hsl(var(--warning))"
                        fillOpacity={0.7}
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Grid de Cards - Próximos Pagamentos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPagamentosProximos.map(pagamento => (
                  <Card 
                    key={pagamento.id}
                    className="hover:shadow-lg transition-all hover:border-warning/50"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge 
                          variant="outline" 
                          className={getBadgeClass(pagamento.status)}
                        >
                          {pagamento.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(pagamento.data_vencimento!)}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {/* Valor Principal */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Valor da Parcela</p>
                        <p className="text-3xl font-bold text-warning">
                          {formatCurrency(pagamento.valor)}
                        </p>
                      </div>

                      {/* Informações do Contrato */}
                      <div className="pt-3 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Contrato:</span>
                          <span className="font-medium">{pagamento.contrato_nome}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">MRR Período:</span>
                          <span className="font-medium">
                            {formatCurrency(pagamento.mrr_periodo)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Taxa:</span>
                          <span className="font-medium">{pagamento.taxa_efetiva}%</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate.push(`/to/contrato/${pagamento.contrato_id}`)}
                      >
                        Ver contrato
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Histórico */}
            <TabsContent value="historico">
              {/* Filtro de Período */}
              <Card className="mb-6 bg-muted border-none">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <p className="text-sm">Pagamentos de</p>
                    <input 
                      type="date" 
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="border rounded-md px-3 py-1 text-sm bg-background"
                    />
                    <p className="text-sm">até</p>
                    <input 
                      type="date" 
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="border rounded-md px-3 py-1 text-sm bg-background"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={aplicarFiltro}
                    >
                      Filtrar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Histórico */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockHistoricoData}>
                      <XAxis 
                        dataKey="mes" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))' 
                        }}
                      />
                      <Bar 
                        dataKey="valor" 
                        fill="hsl(var(--purple))"
                        radius={[8, 8, 0, 0]}
                        onClick={(data) => setMesSelecionado(data.payload.mes)}
                        cursor="pointer"
                      >
                        {mockHistoricoData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={mesSelecionado === entry.mes 
                              ? 'hsl(var(--primary))' 
                              : 'hsl(var(--info))'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tabela de Histórico */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      Pagamentos de {mesSelecionado || 'Todos os períodos'}
                    </CardTitle>
                    {mesSelecionado && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setMesSelecionado(null)}
                      >
                        Ver todos
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {pagamentosHistoricoFiltrados.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contrato</TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => setOrdenacao(ordenacao === 'asc' ? 'desc' : 'asc')}
                            >
                              Data
                              {ordenacao === 'asc' ? ' ▲' : ' ▼'}
                            </Button>
                          </TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>MRR Período</TableHead>
                          <TableHead>Taxa</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagamentosHistoricoFiltrados.map(pagamento => (
                          <TableRow 
                            key={pagamento.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => navigate.push(`/to/contrato/${pagamento.contrato_id}`)}
                          >
                            <TableCell>
                              <div className="font-medium">
                                {pagamento.contrato_nome}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(pagamento.data_pagamento!)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(pagamento.valor)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(pagamento.mrr_periodo)}
                            </TableCell>
                            <TableCell>{pagamento.taxa_efetiva}%</TableCell>
                            <TableCell>
                              <Badge 
                                variant={getBadgeVariant(pagamento.status)}
                                className={getBadgeClass(pagamento.status)}
                              >
                                {pagamento.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate.push(`/to/contrato/${pagamento.contrato_id}`);
                                }}
                              >
                                👁
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-xl font-semibold mb-2">
                        Nenhum pagamento encontrado
                      </h3>
                      <p className="text-muted-foreground">
                        Ajuste o período do filtro para ver mais resultados
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}