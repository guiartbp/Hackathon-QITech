"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';


interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  change?: string;
}

function MetricCardComponent({ label, value, subtitle, change }: MetricCardProps) {
  return (
    <Card className="bg-muted border-none">
      <CardContent className="py-6">
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
        <p className="text-3xl font-bold text-primary mb-1">{value}</p>
        {change && <p className="text-primary text-sm font-medium">{change}</p>}
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export default function PortfolioEvolucao() {
  const navigate = useRouter();
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const [tipoAlocacao, setTipoAlocacao] = useState('risco');
  const [periodoHistorico, setPeriodoHistorico] = useState('1ano');
  const [periodoPerformance, setPeriodoPerformance] = useState('1ano');

  const historicoData = [
    { data: 'Jan/24', valor: 800000 },
    { data: 'Abr/24', valor: 850000 },
    { data: 'Jul/24', valor: 950000 },
    { data: 'Out/24', valor: 1082772.78 }
  ];

  const performanceData = [
    { data: 'Jan/24', carteira: 0, cdi: 0 },
    { data: 'Abr/24', carteira: 6.25, cdi: 3.75 },
    { data: 'Jul/24', carteira: 18.75, cdi: 7.5 },
    { data: 'Out/24', carteira: 35.3, cdi: 10.5 }
  ];

  const alocacaoData = [
    { label: 'A1', percentual: 35, color: '#ff6b35' },
    { label: 'A2', percentual: 32, color: '#ff8c42' },
    { label: 'A3', percentual: 10, color: '#ffb84d' },
    { label: 'A4', percentual: 23, color: '#ffd670' }
  ];

  const ativosData = [
    { id: '1', nome: 'AtaAI', emoji: '🤖', capitalInvestido: 10000, tir: 25, progresso: 35, prazoRestante: 9, recebido: 5042 },
    { id: '2', nome: 'Homodeus AI', emoji: '🧠', capitalInvestido: 42000, tir: 15, progresso: 80, prazoRestante: 2, recebido: 2700 },
    { id: '3', nome: 'TaskTracker', emoji: '📋', capitalInvestido: 10000, tir: 25, progresso: 50, prazoRestante: 11, recebido: 5000 },
    { id: '4', nome: 'Passei', emoji: '🎓', capitalInvestido: 8000, tir: 28, progresso: 80, prazoRestante: 6, recebido: 5000 },
    { id: '5', nome: 'ContratoAI', emoji: '📄', capitalInvestido: 500, tir: 30, progresso: 97, prazoRestante: 1, recebido: 750 },
    { id: '6', nome: 'SyncAgent', emoji: '🔄', capitalInvestido: 2500, tir: 18, progresso: 100, prazoRestante: 0, recebido: 1800 },
    { id: '7', nome: 'FoiscaAI', emoji: '⚡', capitalInvestido: 8000, tir: 17, progresso: 100, prazoRestante: 0, recebido: 10000 },
    { id: '8', nome: 'CloudOpus', emoji: '☁️', capitalInvestido: 1000, tir: 18, progresso: 100, prazoRestante: 0, recebido: 1800 },
    { id: '9', nome: 'PredictivOps', emoji: '🔮', capitalInvestido: 1000, tir: 18, progresso: 100, prazoRestante: 0, recebido: 1800 },
    { id: '10', nome: 'WinwithAI', emoji: '🏆', capitalInvestido: 12300, tir: 23, progresso: 100, prazoRestante: 0, recebido: 15000 },
    { id: '11', nome: 'Katena', emoji: '🔗', capitalInvestido: 1000, tir: 22, progresso: 100, prazoRestante: 0, recebido: 1800 },
    { id: '12', nome: 'UniQ', emoji: '🎯', capitalInvestido: 2500, tir: 18, progresso: 100, prazoRestante: 0, recebido: 3500 },
    { id: '13', nome: 'SensitivAI', emoji: '🧬', capitalInvestido: 1000, tir: 18, progresso: 100, prazoRestante: 0, recebido: 1800 }
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
              <h1 className="text-3xl font-bold text-white mb-8">Olá, Henrique</h1>
        {/* Header com Saldo Total */}
        <Card className="mb-8 bg-gradient-to-r from-muted to-muted/50 border-none">
          <CardContent className="py-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-6xl font-bold text-purple">
                    {saldoVisivel ? 'R$ 1.082.772,78' : '••••••••'}
                  </h1>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSaldoVisivel(!saldoVisivel)}
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <p className="text-primary text-lg font-semibold">
                    + R$ 40.000,00
                  </p>
                  <Badge className="bg-success text-success-foreground text-base">
                    ↑ 4,2%
                  </Badge>
                  <p className="text-muted-foreground">(1 mês)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Indicadores */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <MetricCardComponent
            label="Lucro Total"
            value="+ R$ 600.000,00"
            change="↑ 40%"
          />
          <MetricCardComponent
            label="TIR média"
            value="21,5%"
            subtitle="ao ano"
          />
          <MetricCardComponent
            label="Contratos ativos"
            value="5"
            subtitle="empréstimos"
          />
          <MetricCardComponent
            label="Contratos finalizados"
            value="8"
            subtitle="empréstimos"
          />
        </div>

        {/* Gráficos Comparativos */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Gráfico Histórico */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Histórico</CardTitle>
                <div className="flex gap-1">
                  <Button variant={periodoHistorico === '1ano' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPeriodoHistorico('1ano')}>
                    1 ano
                  </Button>
                  <Button variant="ghost" size="sm">6 meses</Button>
                  <Button variant="ghost" size="sm">90 dias</Button>
                  <Button variant="ghost" size="sm">1 mês</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <Badge variant="outline" className="gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Sua carteira
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={historicoData}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#colorValor)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico Performance */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Performance</CardTitle>
                <div className="flex gap-1">
                  <Button variant={periodoPerformance === '1ano' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPeriodoPerformance('1ano')}>
                    1 ano
                  </Button>
                  <Button variant="ghost" size="sm">6 meses</Button>
                  <Button variant="ghost" size="sm">90 dias</Button>
                  <Button variant="ghost" size="sm">1 mês</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-2">
                <Badge variant="outline" className="gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Sua carteira
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary-dark" />
                  CDI
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={performanceData}>
                  <XAxis 
                    dataKey="data" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `${value.toFixed(1)}%`}
                  />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="carteira" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cdi" 
                    stroke="hsl(var(--secondary-dark))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary-dark))', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alocação */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Alocação</CardTitle>
              <select 
                value={tipoAlocacao} 
                onChange={(e) => setTipoAlocacao(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm"
              >
                <option value="risco">Por classe de risco ▽</option>
                <option value="setor">Por setor</option>
                <option value="maturidade">Por maturidade</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-12">
              {/* Lista de Alocação */}
              <div className="space-y-4">
                {alocacaoData.map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <p className="font-medium">{item.label}</p>
                      </div>
                      <p className="font-semibold text-lg">
                        {item.percentual}%
                      </p>
                    </div>
                    <Progress 
                      value={item.percentual} 
                      className="h-3"
                      style={{ 
                        '--progress-background': item.color 
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>

              {/* Gráfico de Pizza */}
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={alocacaoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="percentual"
                    >
                      {alocacaoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Ativos */}
        <Card>
          <CardHeader>
            <CardTitle>Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Capital Invest.</TableHead>
                  <TableHead>TIR/ano</TableHead>
                  <TableHead>Progresso (%)</TableHead>
                  <TableHead>Prazo Restante</TableHead>
                  <TableHead>Recebido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ativosData.map(ativo => (
                  <TableRow 
                    key={ativo.id}
                    className="cursor-pointer hover:bg-primary-light/10 transition-colors"
                    onClick={() => navigate.push(`/in/contratos/${ativo.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ativo.emoji}</span>
                        <p className="font-medium">{ativo.nome}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(ativo.capitalInvestido)}</TableCell>
                    <TableCell className="text-purple font-semibold">
                      {ativo.tir}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress 
                          value={ativo.progresso} 
                          className="w-24 h-2"
                        />
                        <p className={`font-semibold ${ativo.progresso === 100 ? 'text-warning' : 'text-primary'}`}>
                          {ativo.progresso}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ativo.prazoRestante > 0 ? `${ativo.prazoRestante} meses` : '-'}
                    </TableCell>
                    <TableCell className="text-success font-semibold">
                      {formatCurrency(ativo.recebido)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
