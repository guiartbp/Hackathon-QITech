"use client";

import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatCurrency, formatDate } from '@/lib/format';
import { ExternalLink, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';

interface MetricBoxProps {
  label: string;
  value: string;
  subtitle?: string;
  bgColor: string;
  textColor: string;
}

function MetricBox({ label, value, subtitle, bgColor, textColor }: MetricBoxProps) {
  return (
    <div className={`${bgColor} rounded-lg p-4`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textColor}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

interface MetricDetailRowProps {
  label: string;
  value: string;
  tooltip?: string;
}
 
const salario = fetch

function MetricDetailRow({ label, value, tooltip }: MetricDetailRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border">
      <div className="flex items-center gap-2">
        <p className="text-sm">{label}</p>
        {tooltip && (
          <Info className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

export default function ContratoDetalhes() {
  const { id } = useParams();
  const navigate = useRouter();
  const [zoomStart, setZoomStart] = useState(0);
  const [zoomEnd, setZoomEnd] = useState(9);
  const [contrato, setContrato] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dados do contrato
  
  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando detalhes do contrato...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // No data state
  if (!contrato) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Contrato não encontrado</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Mock data como fallback - remover quando a API estiver pronta
  const contratoData = contrato || {
    id: id || '1',
    nome: 'AtaAI',
    emoji: '🤖',
    score: 82,
    website: 'https://suarevenda.com.br',
    setor: 'IA Generativa para escritórios de advocacia',
    criacao: '2022-12-07',
    historico: '20 empréstimos quitados',
    descricao: 'Capital de Giro para investimento em campanhas de marketing e fortalecimento da comunidade. O dinheiro será direcionado para: Campanhas em LinkedIn, Criação de uma comunidade ativa com devs no discord, Contratação de desenvolvedores para escalar segurança de SaaS e infraestrutura.',
    capitalInvestido: 10000,
    tir: 25,
    recebido: 5042,
    proximoPagamento: 650,
    progresso: 35,
    historicosPagamentos: [
      { mes: 'Jan', valor: 0 },
      { mes: 'Fev', valor: 0 },
      { mes: 'Mar', valor: 550 },
      { mes: 'Abr', valor: 620 },
      { mes: 'Mai', valor: 590 },
      { mes: 'Jun', valor: 480 },
      { mes: 'Jul', valor: 540 },
      { mes: 'Ago', valor: 610 },
      { mes: 'Set', valor: 680 }
    ],
    metricas: {
      mrr: 300000,
      churn: 10,
      runway: 6,
      ltv: 30000,
      cac: 1250,
      numClientes: 150,
      ticketMedio: 2000
    },
    evolucaoARR: [
      { ano: '2022', valor: 50000 },
      { ano: '2023', valor: 280000 },
      { ano: '2024', valor: 360000 }
    ],
    evolucaoMRR: [
      { mes: 'Jan', valor: 280000 },
      { mes: 'Fev', valor: 290000 },
      { mes: 'Mar', valor: 300000 }
    ],
    evolucaoClientes: [
      { mes: 'Jan', valor: 140 },
      { mes: 'Fev', valor: 145 },
      { mes: 'Mar', valor: 150 }
    ]
  };

  const visiblePagamentos = contratoData.historicosPagamentos.slice(zoomStart, zoomEnd);

  const handleZoomStart = () => {
    if (zoomStart > 0) {
      setZoomStart(zoomStart - 1);
      setZoomEnd(zoomEnd - 1);
    }
  };

  const handleZoomEnd = () => {
    if (zoomEnd < contratoData.historicosPagamentos.length) {
      setZoomStart(zoomStart + 1);
      setZoomEnd(zoomEnd + 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate.push('/in/portfolio/evolucao')}
          className="mb-6 text-primary"
        >
          ← Voltar
        </Button>

        {/* Card Principal */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{contratoData.emoji}</span>
              <div>
                <CardTitle className="text-2xl">{contratoData.nome}</CardTitle>
                <a 
                  href={contratoData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {contratoData.website} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-4 gap-4">
              <MetricBox
                label="Capital Investido"
                value={formatCurrency(contratoData.capitalInvestido)}
                bgColor="bg-primary/10"
                textColor="text-primary"
              />
              <MetricBox
                label="TIR"
                value={`${contratoData.tir}%`}
                bgColor="bg-purple/10"
                textColor="text-purple"
              />
              <MetricBox
                label="Recebido"
                value={formatCurrency(contratoData.recebido)}
                bgColor="bg-success/10"
                textColor="text-success"
              />
              <MetricBox
                label="Próximo pagamento"
                value={formatCurrency(contratoData.proximoPagamento)}
                subtitle="2%"
                bgColor="bg-info/10"
                textColor="text-info"
              />
            </div>

            {/* Barra de Progresso */}
            <div>
              <Progress 
                value={contratoData.progresso} 
                className="h-4 mb-2"
              />
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Progresso</p>
                <p className="font-semibold text-primary">
                  {contratoData.progresso}%
                </p>
              </div>
            </div>

            {/* Gráfico de Últimos Pagamentos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Últimos Pagamentos</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleZoomStart}
                    disabled={zoomStart === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleZoomEnd}
                    disabled={zoomEnd >= contratoData.historicosPagamentos.length}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={visiblePagamentos}>
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar 
                    dataKey="valor" 
                    fill="hsl(var(--purple))"
                    radius={[8, 8, 0, 0]}
                  >
                    {visiblePagamentos.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index >= 0 && index <= 1 ? 'hsl(var(--primary))' : 'hsl(var(--purple))'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card "Sobre o SaaS" */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                🏢 Sobre o SaaS
              </CardTitle>
              <Badge variant="outline" className="text-lg">
                Score {contrato.score}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informações Básicas */}
            <div>
              <p className="font-semibold mb-2">
                Setor: {contrato.setor}
              </p>
              <p className="text-sm text-muted-foreground">Criação: {formatDate(contrato.criacao)}</p>
              <p className="text-sm text-muted-foreground">Histórico: {contrato.historico}</p>
            </div>

            {/* Accordion de Descrição */}
            <Accordion type="single" collapsible>
              <AccordionItem value="descricao">
                <AccordionTrigger>Descrição</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed">
                    {contrato.descricao}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="border-t pt-6" />

            {/* Métricas */}
            <div>
              <Accordion type="single" collapsible defaultValue="metricas">
                <AccordionItem value="metricas">
                  <AccordionTrigger>Métricas:</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <MetricDetailRow
                        label="MRR Atual"
                        value={formatCurrency(contrato.metricas.mrr)}
                        tooltip="Monthly Recurring Revenue"
                      />
                      <MetricDetailRow
                        label="Churn"
                        value={`${contrato.metricas.churn}%`}
                        tooltip="Taxa de cancelamento"
                      />
                      <MetricDetailRow
                        label="Runway"
                        value={`${contrato.metricas.runway} meses`}
                        tooltip="Meses de caixa"
                      />
                      <MetricDetailRow
                        label="LTV"
                        value={formatCurrency(contrato.metricas.ltv)}
                        tooltip="Lifetime Value"
                      />
                      <MetricDetailRow
                        label="CAC"
                        value={formatCurrency(contrato.metricas.cac)}
                        tooltip="Customer Acquisition Cost"
                      />
                      <MetricDetailRow
                        label="Número de clientes"
                        value={contrato.metricas.numClientes.toString()}
                      />
                      <MetricDetailRow
                        label="Ticket Médio"
                        value={formatCurrency(contrato.metricas.ticketMedio)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="border-t pt-6" />

            {/* Gráficos de Evolução */}
            <div className="space-y-6">
              <div>
                <h5 className="font-semibold mb-4">Evolução do ARR</h5>
                <div className="bg-chart-bg rounded-lg p-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={contrato.evolucaoARR}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="ano" 
                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-4 text-sm">Evolução do MRR</h5>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={contrato.evolucaoMRR}>
                      <XAxis 
                        dataKey="mes" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="hsl(var(--purple))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h5 className="font-semibold mb-4 text-sm">
                    Evolução do nº de clientes
                  </h5>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={contrato.evolucaoClientes}>
                      <XAxis 
                        dataKey="mes" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="hsl(var(--purple))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
