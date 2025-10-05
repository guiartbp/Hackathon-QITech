"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/format';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  emoji: string | null;
}

interface Pagamento {
  id: string;
  contratoId: string;
  dataVencimento: string;
  dataPagamento: string | null;
  valorPago: number | null;
  mrrPeriodo: number | null;
  taxaEfetiva: number | null;
  status: string;
  contrato: {
    id: string;
    empresaId: string;
  };
}

interface ProjecaoPagamento {
  id: string;
  contratoId: string;
  mesReferencia: string;
  valorProjetado: number;
  mrrProjetado: number | null;
  contrato: {
    id: string;
    empresaId: string;
  };
}

interface PagamentoComEmpresa {
  id: string;
  ativoId: string;
  ativo: { nome: string; emoji: string };
  data: string;
  valor: number;
  mrrPeriodo: number;
  taxaEfetiva: number;
  status: string;
}

interface ChartData {
  mes: string;
  valor: number;
}

export default function PortfolioPagamentos() {
  const navigate = useRouter();
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [pagamentosData, setPagamentosData] = useState<PagamentoComEmpresa[]>([]);
  const [projecoesData, setProjecoesData] = useState<PagamentoComEmpresa[]>([]);
  const [pagamentosHistoricoData, setPagamentosHistoricoData] = useState<ChartData[]>([]);
  const [pagamentosProjecaoData, setPagamentosProjecaoData] = useState<ChartData[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [pagamentosRes, projecoesRes, empresasRes] = await Promise.all([
          fetch('/api/pagamentos'),
          fetch('/api/projecoes-pagamento'),
          fetch('/api/empresas'),
        ]);

        const pagamentos: Pagamento[] = await pagamentosRes.json();
        const projecoes: ProjecaoPagamento[] = await projecoesRes.json();
        const empresas: Empresa[] = await empresasRes.json();

        // Create empresa lookup map
        const empresaMap = new Map(empresas.map(e => [e.id, e]));

        // Transform pagamentos with empresa data
        const pagamentosComEmpresa: PagamentoComEmpresa[] = pagamentos.map(p => {
          const empresa = empresaMap.get(p.contrato.empresaId);
          return {
            id: p.id,
            ativoId: p.contrato.empresaId,
            ativo: {
              nome: empresa?.nomeFantasia || empresa?.razaoSocial || 'Empresa',
              emoji: empresa?.emoji || '🏢'
            },
            data: p.dataPagamento || p.dataVencimento,
            valor: p.valorPago ? Number(p.valorPago) : 0,
            mrrPeriodo: p.mrrPeriodo ? Number(p.mrrPeriodo) : 0,
            taxaEfetiva: p.taxaEfetiva ? Number(p.taxaEfetiva) : 0,
            status: p.status
          };
        });

        // Transform projecoes with empresa data
        const projecoesComEmpresa: PagamentoComEmpresa[] = projecoes.map(p => {
          const empresa = empresaMap.get(p.contrato.empresaId);
          return {
            id: p.id,
            ativoId: p.contrato.empresaId,
            ativo: {
              nome: empresa?.nomeFantasia || empresa?.razaoSocial || 'Empresa',
              emoji: empresa?.emoji || '🏢'
            },
            data: p.mesReferencia,
            valor: Number(p.valorProjetado),
            mrrPeriodo: p.mrrProjetado ? Number(p.mrrProjetado) : 0,
            taxaEfetiva: 0, // Projeções não têm taxa efetiva
            status: 'AGUARDADO'
          };
        });

        // Aggregate pagamentos by month for chart
        const pagamentosPorMes = pagamentos.reduce((acc, p) => {
          const date = new Date(p.dataPagamento || p.dataVencimento);
          const mes = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
          const mesKey = mes.charAt(0).toUpperCase() + mes.slice(1);

          if (!acc[mesKey]) {
            acc[mesKey] = 0;
          }
          acc[mesKey] += p.valorPago ? Number(p.valorPago) : 0;
          return acc;
        }, {} as Record<string, number>);

        const historicoChart: ChartData[] = Object.entries(pagamentosPorMes).map(([mes, valor]) => ({
          mes,
          valor
        }));

        // Aggregate projecoes by month for chart
        const projecoesPorMes = projecoes.reduce((acc, p) => {
          const date = new Date(p.mesReferencia);
          const mes = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
          const mesKey = mes.charAt(0).toUpperCase() + mes.slice(1);

          if (!acc[mesKey]) {
            acc[mesKey] = 0;
          }
          acc[mesKey] += Number(p.valorProjetado);
          return acc;
        }, {} as Record<string, number>);

        const projecaoChart: ChartData[] = Object.entries(projecoesPorMes).map(([mes, valor]) => ({
          mes,
          valor
        }));

        // Update states
        setPagamentosData(pagamentosComEmpresa);
        setProjecoesData(projecoesComEmpresa);
        setPagamentosHistoricoData(historicoChart);
        setPagamentosProjecaoData(projecaoChart);
      } catch (error) {
        console.error('Error fetching pagamentos data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Meus Pagamentos</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Meus Pagamentos</h1>

        <Tabs defaultValue="historico" className="space-y-6">
          <TabsList>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="projecao">Projeção</TabsTrigger>
          </TabsList>

          {/* Tab: Histórico */}
          <TabsContent value="historico" className="space-y-6">
            {/* Filtro de Data */}
            <Card className="bg-muted">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm">Últimos pagamentos de</p>
                  <input 
                    type="date" 
                    defaultValue="2024-03-01"
                    className="border rounded-md px-3 py-1 text-sm"
                  />
                  <p className="text-sm">até</p>
                  <input 
                    type="date" 
                    defaultValue="2024-10-31"
                    className="border rounded-md px-3 py-1 text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Barras */}
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos por mês</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pagamentosHistoricoData}>
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
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar 
                      dataKey="valor" 
                      fill="hsl(var(--purple))"
                      radius={[8, 8, 0, 0]}
                      onClick={(data) => setMesSelecionado(data.payload?.mes)}
                      cursor="pointer"
                    >
                      {pagamentosHistoricoData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={mesSelecionado === entry.mes ? 'hsl(var(--primary))' : 'hsl(var(--purple))'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabela de Pagamentos */}
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos de Outubro/2024</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ativos</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>MRR Período</TableHead>
                      <TableHead>Taxa Efetiva</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagamentosData.map(pgto => (
                      <TableRow key={pgto.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{pgto.ativo.emoji}</span>
                            <p>{pgto.ativo.nome}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(pgto.data)}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(pgto.valor)}
                        </TableCell>
                        <TableCell>{formatCurrency(pgto.mrrPeriodo)}</TableCell>
                        <TableCell>{pgto.taxaEfetiva}%</TableCell>
                        <TableCell>
                          <Badge variant={pgto.status === 'PAGO' ? 'default' : 'destructive'}>
                            {pgto.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate.push(`/in/contratos/${pgto.ativoId}`)}
                          >
                            👁
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Projeção */}
          <TabsContent value="projecao" className="space-y-6">
            {/* Filtro de Data */}
            <Card className="bg-muted">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm">Próximos pagamentos de</p>
                  <input 
                    type="date" 
                    defaultValue="2024-11-01"
                    className="border rounded-md px-3 py-1 text-sm"
                  />
                  <p className="text-sm">até</p>
                  <input 
                    type="date" 
                    defaultValue="2025-06-30"
                    className="border rounded-md px-3 py-1 text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Barras (Projeção) */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pagamentosProjecaoData}>
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
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
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

            {/* Tabela de Projeções */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ativos</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>MRR Período</TableHead>
                      <TableHead>Taxa Efetiva</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projecoesData.map(proj => (
                      <TableRow key={proj.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{proj.ativo.emoji}</span>
                            <p>{proj.ativo.nome}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(proj.data)}</TableCell>
                        <TableCell className="font-semibold text-warning">
                          {formatCurrency(proj.valor)}
                        </TableCell>
                        <TableCell>{formatCurrency(proj.mrrPeriodo)}</TableCell>
                        <TableCell>{proj.taxaEfetiva}%</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-warning border-warning">
                            AGUARDADO
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate.push(`/in/contratos/${proj.ativoId}`)}
                          >
                            👁
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
