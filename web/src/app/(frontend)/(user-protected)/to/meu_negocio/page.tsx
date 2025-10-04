"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '@/lib/format';
import { ExternalLink } from 'lucide-react';

// Type Definitions
interface EmpresaData {
  nome: string;
  emoji: string;
  website: string;
}

interface MetricasResumo {
  mrr: number;
  mrr_variacao: number;
  arr: number;
  arr_variacao: number;
  churn_rate: number;
  nrr: number;
  runway: number;
  num_clientes: number;
  novos_clientes_mes: number;
  cac: number;
  ltv: number;
  ltv_cac_ratio: number;
  cac_payback: number;
  margem_bruta: number;
  arpu: number;
}

interface PlanoMRR {
  nome: string;
  mrr: number;
  percentual: number;
  cor: string;
}

interface TopCliente {
  nome: string;
  emoji: string;
  plano: string;
  mrr: number;
  percentual: number;
}

interface Cohort {
  mes: string;
  clientes_iniciais: number;
  retencao_m1: number;
  retencao_m3: number;
  retencao_m6: number;
  ltv_medio: number;
}

interface Insight {
  tipo: 'info' | 'alerta' | 'critico';
  titulo: string;
  descricao: string;
}

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  badge?: 'success' | 'warning';
  icon?: string;
  variant: 'primary' | 'purple' | 'neutral';
}

// MetricCard Component
function MetricCard({ label, value, change, trend, badge, icon, variant }: MetricCardProps) {
  const variantClasses = {
    primary: 'bg-primary/10 border-primary/30',
    purple: 'bg-purple-500/10 border-purple-500/30',
    neutral: 'bg-muted border-border'
  };
  
  return (
    <Card className={`${variantClasses[variant]} border-2`}>
      <CardContent className="py-6">
        {icon && <span className="text-3xl mb-2 block">{icon}</span>}
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold mb-1">{value}</p>
        
        {change && (
          <div className="flex items-center gap-1">
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
          </div>
        )}
        
        {badge && (
          <Badge 
            variant="outline" 
            className={`text-xs ${badge === 'success' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}
          >
            {badge === 'success' ? '✓ Saudável' : '⚠ Atenção'}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

// Helper Functions
const getCohortBadgeClass = (retencao: number): string => {
  if (retencao >= 80) return 'bg-green-500 text-white';
  if (retencao >= 60) return 'bg-yellow-500 text-white';
  return 'bg-red-500 text-white';
};

// Mock Data
const mockEmpresa: EmpresaData = {
  nome: 'MeuSaaS AI',
  emoji: '🤖',
  website: 'https://meusaas.ai'
};

const mockMetricas: MetricasResumo = {
  mrr: 150000,
  mrr_variacao: 12.5,
  arr: 1800000,
  arr_variacao: 45.2,
  churn_rate: 2.5,
  nrr: 112,
  runway: 14,
  num_clientes: 150,
  novos_clientes_mes: 12,
  cac: 1250,
  ltv: 30000,
  ltv_cac_ratio: 3.5,
  cac_payback: 8,
  margem_bruta: 85,
  arpu: 1000
};

const mockMRRPorPlano: PlanoMRR[] = [
  { nome: 'Enterprise', mrr: 75000, percentual: 50, cor: '#ff6b35' },
  { nome: 'Pro', mrr: 52500, percentual: 35, cor: '#9b59b6' },
  { nome: 'Starter', mrr: 22500, percentual: 15, cor: '#3498db' }
];

const mockTopClientes: TopCliente[] = [
  { nome: 'TechCorp', emoji: '🏢', plano: 'Enterprise', mrr: 15000, percentual: 10 },
  { nome: 'StartupXYZ', emoji: '🚀', plano: 'Pro', mrr: 8500, percentual: 5.7 },
  { nome: 'Digital Agency', emoji: '💼', plano: 'Enterprise', mrr: 12000, percentual: 8 },
  { nome: 'CloudSystems', emoji: '☁️', plano: 'Pro', mrr: 6000, percentual: 4 },
  { nome: 'DataLabs', emoji: '🔬', plano: 'Pro', mrr: 5500, percentual: 3.7 }
];

const mockCohortsData: Cohort[] = [
  { mes: 'Jun/24', clientes_iniciais: 25, retencao_m1: 92, retencao_m3: 84, retencao_m6: 76, ltv_medio: 28500 },
  { mes: 'Jul/24', clientes_iniciais: 30, retencao_m1: 90, retencao_m3: 80, retencao_m6: 0, ltv_medio: 27000 },
  { mes: 'Ago/24', clientes_iniciais: 28, retencao_m1: 93, retencao_m3: 86, retencao_m6: 0, ltv_medio: 29000 },
  { mes: 'Set/24', clientes_iniciais: 35, retencao_m1: 94, retencao_m3: 0, retencao_m6: 0, ltv_medio: 30000 },
  { mes: 'Out/24', clientes_iniciais: 32, retencao_m1: 0, retencao_m3: 0, retencao_m6: 0, ltv_medio: 0 }
];

const mockInsights: Insight[] = [
  {
    tipo: 'alerta',
    titulo: 'Churn aumentou 0.5% este mês',
    descricao: 'Aumente o engajamento com clientes em risco através de pesquisas de satisfação.'
  },
  {
    tipo: 'info',
    titulo: '5 clientes elegíveis para upsell',
    descricao: 'Clientes no plano Starter com alto engajamento podem migrar para Pro.'
  },
  {
    tipo: 'critico',
    titulo: 'Cliente chave em risco',
    descricao: 'TechCorp (10% do MRR) reduziu uso em 40% nas últimas 2 semanas.'
  }
];

const mockEvolucaoARR = [
  { mes: 'Jan/24', valor: 1200000 },
  { mes: 'Fev/24', valor: 1280000 },
  { mes: 'Mar/24', valor: 1350000 },
  { mes: 'Abr/24', valor: 1420000 },
  { mes: 'Mai/24', valor: 1510000 },
  { mes: 'Jun/24', valor: 1620000 },
  { mes: 'Jul/24', valor: 1680000 },
  { mes: 'Ago/24', valor: 1740000 },
  { mes: 'Set/24', valor: 1800000 }
];

const mockEvolucaoMRR = [
  { mes: 'Mai/24', valor: 135000, projecao: null },
  { mes: 'Jun/24', valor: 140000, projecao: null },
  { mes: 'Jul/24', valor: 145000, projecao: null },
  { mes: 'Ago/24', valor: 148000, projecao: null },
  { mes: 'Set/24', valor: 150000, projecao: null },
  { mes: 'Out/24', valor: null, projecao: 158000 },
  { mes: 'Nov/24', valor: null, projecao: 165000 },
  { mes: 'Dez/24', valor: null, projecao: 172000 }
];

const mockExpansionContraction = [
  { mes: 'Mai/24', expansion: 8500, contraction: 2200 },
  { mes: 'Jun/24', expansion: 9200, contraction: 1800 },
  { mes: 'Jul/24', expansion: 7800, contraction: 2500 },
  { mes: 'Ago/24', expansion: 10500, contraction: 1500 },
  { mes: 'Set/24', expansion: 11200, contraction: 1900 },
  { mes: 'Out/24', expansion: 9800, contraction: 2100 }
];

const mockEvolucaoClientes = [
  { mes: 'Mai/24', total: 125 },
  { mes: 'Jun/24', total: 132 },
  { mes: 'Jul/24', total: 138 },
  { mes: 'Ago/24', total: 143 },
  { mes: 'Set/24', total: 147 },
  { mes: 'Out/24', total: 150 }
];

export default function MeuNegocio() {
  const [periodoARR, setPeriodoARR] = useState<'6m' | '12m' | '2a'>('12m');

  const empresaData = mockEmpresa;
  const metricas = mockMetricas;
  const mrrPorPlano = mockMRRPorPlano;
  const topClientes = mockTopClientes;
  const cohortsData = mockCohortsData;
  const insights = mockInsights;
  const evolucaoARR = mockEvolucaoARR;
  const evolucaoMRR = mockEvolucaoMRR;
  const expansionContractionData = mockExpansionContraction;
  const evolucaoClientes = mockEvolucaoClientes;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header com Informações da Empresa */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{empresaData.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{empresaData.nome}</h1>
              <a 
                href={empresaData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {empresaData.website} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Acompanhe as métricas-chave e a saúde financeira do seu SaaS em tempo real
          </p>
        </div>

        {/* Seção 1: Métricas Principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="MRR Atual"
            value={formatCurrency(metricas.mrr)}
            change={`${metricas.mrr_variacao > 0 ? '+' : ''}${metricas.mrr_variacao}%`}
            trend={metricas.mrr_variacao > 0 ? 'up' : 'down'}
            icon="💰"
            variant="neutral"
          />
          
          <MetricCard
            label="ARR"
            value={formatCurrency(metricas.arr)}
            change={`${metricas.arr_variacao > 0 ? '+' : ''}${metricas.arr_variacao}%`}
            trend={metricas.arr_variacao > 0 ? 'up' : 'down'}
            icon="📊"
            variant="neutral"
          />
          
          <MetricCard
            label="Churn Rate"
            value={`${metricas.churn_rate.toFixed(1)}%`}
            badge={metricas.churn_rate < 3 ? 'success' : 'warning'}
            icon="📉"
            variant="neutral"
          />
          
          <MetricCard
            label="NRR"
            value={`${metricas.nrr}%`}
            badge={metricas.nrr > 100 ? 'success' : 'warning'}
            icon="🔄"
            variant="neutral"
          />
          
          <MetricCard
            label="Runway"
            value={`${metricas.runway} meses`}
            badge={metricas.runway > 12 ? 'success' : 'warning'}
            icon="🛤️"
            variant="neutral"
          />
          
          <MetricCard
            label="Clientes Ativos"
            value={metricas.num_clientes.toString()}
            change={`+${metricas.novos_clientes_mes} este mês`}
            icon="👥"
            variant="neutral"
          />
          
          <MetricCard
            label="CAC"
            value={formatCurrency(metricas.cac)}
            icon="🎯"
            variant="neutral"
          />
          
          <MetricCard
            label="LTV"
            value={formatCurrency(metricas.ltv)}
            icon="💎"
            variant="neutral"
          />
        </div>

        {/* Seção 2: Gráficos de Evolução */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico 1: Evolução do ARR */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Evolução do ARR</CardTitle>
                <div className="flex gap-1">
                  <Button 
                    variant={periodoARR === '6m' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => setPeriodoARR('6m')}
                  >
                    6m
                  </Button>
                  <Button 
                    variant={periodoARR === '12m' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => setPeriodoARR('12m')}
                  >
                    12m
                  </Button>
                  <Button 
                    variant={periodoARR === '2a' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => setPeriodoARR('2a')}
                  >
                    2a
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={evolucaoARR}>
                  <defs>
                    <linearGradient id="colorARR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fill="url(#colorARR)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico 2: Evolução do MRR com Projeção */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do MRR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-3">
                <Badge variant="outline" className="gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  MRR Real
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  Projeção
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={evolucaoMRR}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="rgb(168 85 247)" 
                    strokeWidth={3}
                    dot={{ fill: 'rgb(168 85 247)', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projecao" 
                    stroke="rgb(234 179 8)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'rgb(234 179 8)', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Seção 3: Métricas de Eficiência */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card 1: LTV:CAC Ratio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚖️ LTV:CAC Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-6xl font-bold text-primary mb-2">
                  {metricas.ltv_cac_ratio.toFixed(1)}:1
                </p>
                <Badge className={metricas.ltv_cac_ratio > 3 ? 'bg-green-500' : 'bg-yellow-500'}>
                  {metricas.ltv_cac_ratio > 3 ? '✓ Excelente' : '⚠ Bom'}
                </Badge>
              </div>
              
              {/* Barra de Referência */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Benchmark</span>
                  <span className="font-semibold">3:1</span>
                </div>
                <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min((metricas.ltv_cac_ratio / 5) * 100, 100)}%` }}
                  />
                  {/* Linha de Benchmark */}
                  <div className="absolute left-[60%] top-0 bottom-0 w-0.5 bg-green-500" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0:1</span>
                  <span className="text-green-500">3:1 (ideal)</span>
                  <span>5:1</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">LTV:</span>
                  <span className="font-semibold">{formatCurrency(metricas.ltv)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CAC:</span>
                  <span className="font-semibold">{formatCurrency(metricas.cac)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: CAC Payback Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⏱️ CAC Payback Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-6xl font-bold text-purple-500 mb-2">
                  {metricas.cac_payback}
                </p>
                <p className="text-lg text-muted-foreground mb-2">meses</p>
                <Badge className={metricas.cac_payback < 12 ? 'bg-green-500' : 'bg-yellow-500'}>
                  {metricas.cac_payback < 12 ? '✓ Rápido' : '⚠ Moderado'}
                </Badge>
              </div>
              
              {/* Progress Circular Visual */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Meta</span>
                  <span className="font-semibold">{'< 12 meses'}</span>
                </div>
                <Progress 
                  value={Math.min((12 / metricas.cac_payback) * 100, 100)} 
                  className="h-3"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CAC:</span>
                  <span className="font-semibold">{formatCurrency(metricas.cac)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Margem Bruta:</span>
                  <span className="font-semibold">{metricas.margem_bruta}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ARPU:</span>
                  <span className="font-semibold">{formatCurrency(metricas.arpu)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção 4: Distribuição de Receita */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card 1: MRR por Plano */}
          <Card>
            <CardHeader>
              <CardTitle>MRR por Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mrrPorPlano.map((plano, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: plano.cor }}
                        />
                        <span className="font-medium">{plano.nome}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(plano.mrr)}</p>
                        <p className="text-xs text-muted-foreground">
                          {plano.percentual}% do total
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={plano.percentual} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold">
                <span>Total MRR:</span>
                <span className="text-primary">{formatCurrency(metricas.mrr)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Expansion vs Contraction */}
          <Card>
            <CardHeader>
              <CardTitle>Expansion vs Contraction</CardTitle>
              <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={expansionContractionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="expansion" 
                    fill="rgb(34 197 94)" 
                    name="Expansion"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="contraction" 
                    fill="rgb(234 179 8)" 
                    name="Contraction"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Seção 5: Análise de Clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Evolução de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={evolucaoClientes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    name="Clientes Ativos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Card 2: Top 5 Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Clientes por MRR</CardTitle>
              <p className="text-sm text-muted-foreground">
                Representam {topClientes.reduce((acc, c) => acc + c.percentual, 0).toFixed(1)}% do MRR total
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClientes.map((cliente, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-lg">{cliente.emoji}</span>
                      </div>
                      <div>
                        <p className="font-medium">{cliente.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {cliente.plano}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(cliente.mrr)}</p>
                      <Badge 
                        variant="outline" 
                        className={cliente.percentual > 10 ? 'border-yellow-500 text-yellow-500' : ''}
                      >
                        {cliente.percentual.toFixed(1)}%
                        {cliente.percentual > 10 && ' ⚠'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {topClientes.some(c => c.percentual > 10) && (
                <Alert className="mt-4 bg-yellow-500/10 border-yellow-500/30">
                  <AlertDescription className="text-sm">
                    ⚠ <strong>Risco de Concentração:</strong> Você tem clientes representando 
                    mais de 10% do MRR total.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Seção 6: Cohort Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Análise de Cohorts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Retenção de clientes por mês de aquisição
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cohort</TableHead>
                    <TableHead className="text-center">Clientes Iniciais</TableHead>
                    <TableHead className="text-center">M0</TableHead>
                    <TableHead className="text-center">M1</TableHead>
                    <TableHead className="text-center">M3</TableHead>
                    <TableHead className="text-center">M6</TableHead>
                    <TableHead className="text-right">LTV Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cohortsData.map((cohort, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{cohort.mes}</TableCell>
                      <TableCell className="text-center">{cohort.clientes_iniciais}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-500 text-white">
                          100%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getCohortBadgeClass(cohort.retencao_m1)}>
                          {cohort.retencao_m1}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {cohort.retencao_m3 > 0 ? (
                          <Badge className={getCohortBadgeClass(cohort.retencao_m3)}>
                            {cohort.retencao_m3}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {cohort.retencao_m6 > 0 ? (
                          <Badge className={getCohortBadgeClass(cohort.retencao_m6)}>
                            {cohort.retencao_m6}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {cohort.ltv_medio > 0 ? formatCurrency(cohort.ltv_medio) : '--'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Seção 7: Insights e Alertas */}
        {insights.length > 0 && (
          <Card className="bg-blue-500/5 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💡 Insights e Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <Alert 
                    key={index}
                    className={`bg-background ${
                      insight.tipo === 'alerta' 
                        ? 'border-yellow-500/50' 
                        : insight.tipo === 'critico'
                        ? 'border-red-500/50'
                        : 'border-blue-500/50'
                    }`}
                  >
                    <AlertDescription className="flex items-start gap-3">
                      <span className="text-xl">
                        {insight.tipo === 'alerta' ? '⚠️' : 
                         insight.tipo === 'critico' ? '🚨' : '💡'}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{insight.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          {insight.descricao}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}