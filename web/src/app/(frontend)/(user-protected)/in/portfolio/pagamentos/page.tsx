"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/format';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function PortfolioPagamentos() {
  const navigate = useRouter();
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);

  const pagamentosHistoricoData = [
    { mes: 'Mar/24', valor: 245000 },
    { mes: 'Abr/24', valor: 223000 },
    { mes: 'Mai/24', valor: 189000 },
    { mes: 'Jun/24', valor: 152000 },
    { mes: 'Jul/24', valor: 267000 },
    { mes: 'Ago/24', valor: 234000 },
    { mes: 'Set/24', valor: 195000 },
    { mes: 'Out/24', valor: 278025 }
  ];

  const pagamentosData = [
    {
      id: '1',
      ativoId: '1',
      ativo: { nome: 'AtaAI', emoji: '🤖' },
      data: '2024-10-15',
      valor: 5042,
      mrrPeriodo: 183042,
      taxaEfetiva: 3.5,
      status: 'PAGO'
    },
    {
      id: '2',
      ativoId: '2',
      ativo: { nome: 'Homodeus AI', emoji: '🧠' },
      data: '2024-10-19',
      valor: 2192,
      mrrPeriodo: 35042,
      taxaEfetiva: 6,
      status: 'PAGO'
    },
    {
      id: '3',
      ativoId: '3',
      ativo: { nome: 'TaskTracker', emoji: '📋' },
      data: '2024-10-22',
      valor: 10052,
      mrrPeriodo: 300092,
      taxaEfetiva: 3.3,
      status: 'ATRASADO'
    },
    {
      id: '4',
      ativoId: '4',
      ativo: { nome: 'Passei', emoji: '🎓' },
      data: '2024-10-10',
      valor: 8500,
      mrrPeriodo: 250000,
      taxaEfetiva: 3.4,
      status: 'PAGO'
    },
    {
      id: '5',
      ativoId: '5',
      ativo: { nome: 'ContratoAI', emoji: '📄' },
      data: '2024-10-05',
      valor: 450,
      mrrPeriodo: 15000,
      taxaEfetiva: 3.0,
      status: 'PAGO'
    }
  ];

  const pagamentosProjecaoData = [
    { mes: 'Nov/24', valor: 290000 },
    { mes: 'Dez/24', valor: 305000 },
    { mes: 'Jan/25', valor: 280000 },
    { mes: 'Fev/25', valor: 315000 },
    { mes: 'Mar/25', valor: 195000 },
    { mes: 'Abr/25', valor: 245000 },
    { mes: 'Mai/25', valor: 280000 },
    { mes: 'Jun/25', valor: 330000 }
  ];

  const projecoesData = [
    {
      id: '1',
      ativoId: '1',
      ativo: { nome: 'AtaAI', emoji: '🤖' },
      data: '2024-11-15',
      valor: 5200,
      mrrPeriodo: 185000,
      taxaEfetiva: 3.5,
      status: 'AGUARDADO'
    },
    {
      id: '2',
      ativoId: '2',
      ativo: { nome: 'Homodeus AI', emoji: '🧠' },
      data: '2024-11-19',
      valor: 2300,
      mrrPeriodo: 36000,
      taxaEfetiva: 6.0,
      status: 'AGUARDADO'
    },
    {
      id: '3',
      ativoId: '3',
      ativo: { nome: 'TaskTracker', emoji: '📋' },
      data: '2024-11-22',
      valor: 10500,
      mrrPeriodo: 310000,
      taxaEfetiva: 3.4,
      status: 'AGUARDADO'
    },
    {
      id: '4',
      ativoId: '4',
      ativo: { nome: 'Passei', emoji: '🎓' },
      data: '2024-11-10',
      valor: 8800,
      mrrPeriodo: 255000,
      taxaEfetiva: 3.5,
      status: 'AGUARDADO'
    }
  ];

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
                            onClick={() => navigate.push(`/in/contrato/${pgto.ativoId}`)}
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
                            onClick={() => navigate.push(`/in/contrato/${proj.ativoId}`)}
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
