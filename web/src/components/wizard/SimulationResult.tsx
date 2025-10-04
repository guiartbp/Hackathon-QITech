import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SimulationData {
  valor_solicitado: number;
  multiplo_cap: number; // Ex: 1.3x
  percentual_mrr: number; // Ex: 4.2% do MRR
  mrr_atual: number;
  valor_total_retorno: number; // valor_solicitado * multiplo_cap
  custo_total: number; // valor_total_retorno - valor_solicitado
  primeira_parcela: string;
  projecoes: {
    cenario: 'conservador' | 'base' | 'otimista';
    crescimento_mrr_mensal: number;
    prazo_estimado_meses: number;
    cronograma: {
      mes: number;
      data: string;
      mrr_projetado: number;
      valor_parcela: number; // % do MRR
      acumulado_pago: number;
      saldo_restante: number;
    }[];
  }[];
}

interface SimulationResultProps {
  simulation: SimulationData;
  loading?: boolean;
}

export function SimulationResult({ simulation, loading }: SimulationResultProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Calculando simulação RBF...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use base scenario for main display
  const cenarioBase = simulation.projecoes.find(p => p.cenario === 'base') || simulation.projecoes[0];
  
  // Prepare chart data - show first 12 months of base scenario
  const chartData = cenarioBase.cronograma.slice(0, 12).map(item => ({
    mes: `M${item.mes}`,
    mrr: item.mrr_projetado,
    pagamento: item.valor_parcela,
    acumulado: item.acumulado_pago
  }));

  return (
    <div className="space-y-6">
      {/* RBF Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Valor Solicitado</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(simulation.valor_solicitado)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">% do MRR</p>
            <p className="text-xl font-bold text-purple-500">
              {simulation.percentual_mrr.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Múltiplo Cap</p>
            <p className="text-xl font-bold text-green-500">
              {simulation.multiplo_cap.toFixed(2)}x
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">MRR Atual</p>
            <p className="text-xl font-bold">
              {formatCurrency(simulation.mrr_atual)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RBF Model Explanation */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h4 className="font-semibold mb-2">Como funciona o Revenue Based Funding</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Pagamento flexível:</strong> Você paga {simulation.percentual_mrr.toFixed(1)}% do seu MRR por mês</li>
                <li>• <strong>Cresce com você:</strong> Se o MRR subir, o pagamento sobe proporcionalmente</li>
                <li>• <strong>Proteção no downturn:</strong> Se o MRR cair, o pagamento também cai</li>
                <li>• <strong>Limite claro:</strong> Total máximo a pagar é {formatCurrency(simulation.valor_total_retorno)} ({simulation.multiplo_cap.toFixed(2)}x)</li>
                <li>• <strong>Sem prazo fixo:</strong> Termina quando atingir o múltiplo cap</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Projections */}
      <Card>
        <CardHeader>
          <CardTitle>Projeções por Cenário</CardTitle>
          <p className="text-sm text-muted-foreground">
            Simulações baseadas em diferentes taxas de crescimento do MRR
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {simulation.projecoes.map((projecao) => {
              const cor = projecao.cenario === 'conservador' ? 'text-red-500' : 
                         projecao.cenario === 'base' ? 'text-blue-500' : 'text-green-500';
              const bgCor = projecao.cenario === 'conservador' ? 'bg-red-500/5 border-red-500/20' : 
                           projecao.cenario === 'base' ? 'bg-blue-500/5 border-blue-500/20' : 
                           'bg-green-500/5 border-green-500/20';
              
              return (
                <Card key={projecao.cenario} className={bgCor}>
                  <CardContent className="p-4 text-center">
                    <Badge variant="outline" className={`mb-3 ${cor} border-current`}>
                      {projecao.cenario.charAt(0).toUpperCase() + projecao.cenario.slice(1)}
                    </Badge>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Crescimento MRR/Mês</p>
                        <p className="font-semibold">{projecao.crescimento_mrr_mensal.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Prazo Estimado</p>
                        <p className="font-semibold">{projecao.prazo_estimado_meses} meses</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">1º Pagamento</p>
                        <p className="font-semibold">
                          {formatCurrency(projecao.cronograma[0]?.valor_parcela || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR and Payment Evolution */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução MRR vs Pagamento</CardTitle>
            <p className="text-sm text-muted-foreground">Cenário base - primeiros 12 meses</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
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
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'mrr' ? 'MRR' : name === 'pagamento' ? 'Pagamento' : 'Acumulado'
                  ]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mrr" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  name="MRR"
                />
                <Line 
                  type="monotone" 
                  dataKey="pagamento" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-2))', r: 3 }}
                  name="Pagamento"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Valor Solicitado:</span>
              <span className="font-semibold">{formatCurrency(simulation.valor_solicitado)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Múltiplo Cap:</span>
              <Badge variant="outline" className="text-green-500 border-green-500/30">
                {simulation.multiplo_cap.toFixed(2)}x
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Máximo a Pagar:</span>
              <span className="font-semibold">{formatCurrency(simulation.valor_total_retorno)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Custo do Capital:</span>
              <span className="font-semibold text-yellow-500">
                {formatCurrency(simulation.custo_total)}
              </span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">% do MRR Atual:</span>
                <span className="font-semibold text-purple-500">
                  {simulation.percentual_mrr.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">MRR Atual:</span>
              <span className="font-semibold">{formatCurrency(simulation.mrr_atual)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Primeira Parcela:</span>
              <span className="font-semibold">{simulation.primeira_parcela}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}