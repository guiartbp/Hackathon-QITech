"use client";
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/format';

// Interfaces TypeScript
interface Feature {
  valor: number;
  peso: number; // 1-5 (importância)
}

interface Categoria {
  score: number; // 0-100
  features: {
    [key: string]: Feature;
  };
}

interface Recomendacao {
  titulo: string;
  descricao: string;
  categoria: string;
  impacto_estimado: number;
}

interface ScoreBreakdown {
  score_total: number;
  tier: 'Excelente' | 'Bom' | 'Regular' | 'Baixo';
  variacao_mensal: number;
  ranking_percentil: number;
  categorias: {
    receita_crescimento: Categoria & {
      features: {
        mrr: Feature;
        arr: Feature;
        nrr: Feature;
        churn_projetado: Feature;
      };
    };
    eficiencia_roi: Categoria & {
      features: {
        cac: Feature;
        cac_payback: Feature;
        ltv_cac: Feature;
        magic_number: Feature;
      };
    };
    saude_sustentabilidade: Categoria & {
      features: {
        burn_multiple: Feature;
        runway: Feature;
        dscr: Feature;
      };
    };
    qualidade_receita: Categoria & {
      features: {
        expansion_pct: Feature;
        contraction_pct: Feature;
        cohort_ltv: Feature;
        upsell_downsell: Feature;
      };
    };
  };
  recomendacoes: Recomendacao[];
}

// Mock Data
const mockScoreData: ScoreBreakdown = {
  score_total: 82,
  tier: 'Bom',
  variacao_mensal: 5,
  ranking_percentil: 15,
  categorias: {
    receita_crescimento: {
      score: 88,
      features: {
        mrr: { valor: 150000, peso: 5 },
        arr: { valor: 1800000, peso: 4 },
        nrr: { valor: 112, peso: 5 },
        churn_projetado: { valor: 2.5, peso: 4 }
      }
    },
    eficiencia_roi: {
      score: 75,
      features: {
        cac: { valor: 1250, peso: 4 },
        cac_payback: { valor: 8, peso: 3 },
        ltv_cac: { valor: 3.5, peso: 5 },
        magic_number: { valor: 1.2, peso: 3 }
      }
    },
    saude_sustentabilidade: {
      score: 78,
      features: {
        burn_multiple: { valor: 1.8, peso: 4 },
        runway: { valor: 14, peso: 5 },
        dscr: { valor: 1.35, peso: 5 }
      }
    },
    qualidade_receita: {
      score: 85,
      features: {
        expansion_pct: { valor: 15, peso: 4 },
        contraction_pct: { valor: 2, peso: 3 },
        cohort_ltv: { valor: 24000, peso: 4 },
        upsell_downsell: { valor: 7.5, peso: 3 }
      }
    }
  },
  recomendacoes: [
    {
      titulo: 'Reduza seu Churn para < 2%',
      descricao: 'Implementar pesquisas de satisfação e melhorar onboarding pode reduzir significativamente o churn projetado.',
      categoria: 'Receita e Crescimento',
      impacto_estimado: 8
    },
    {
      titulo: 'Aumente seu Runway para > 18 meses',
      descricao: 'Otimize custos operacionais ou aumente MRR para melhorar sua margem de segurança.',
      categoria: 'Saúde e Sustentabilidade',
      impacto_estimado: 5
    },
    {
      titulo: 'Melhore LTV:CAC para > 4:1',
      descricao: 'Foque em canais de aquisição mais eficientes ou aumente o ticket médio através de upsells.',
      categoria: 'Eficiência e ROI',
      impacto_estimado: 6
    }
  ]
};

// Dados para Radar Chart
const radarData = [
  {
    categoria: 'Receita e\nCrescimento',
    valor: mockScoreData.categorias.receita_crescimento.score,
    principais_metricas: ['MRR: R$ 150k', 'NRR: 112%', 'Churn: 2.5%']
  },
  {
    categoria: 'Eficiência\ne ROI',
    valor: mockScoreData.categorias.eficiencia_roi.score,
    principais_metricas: ['LTV:CAC: 3.5:1', 'CAC Payback: 8m', 'Magic: 1.2']
  },
  {
    categoria: 'Saúde e\nSustentabilidade',
    valor: mockScoreData.categorias.saude_sustentabilidade.score,
    principais_metricas: ['Runway: 14m', 'DSCR: 1.35', 'Burn: 1.8x']
  },
  {
    categoria: 'Qualidade da\nReceita',
    valor: mockScoreData.categorias.qualidade_receita.score,
    principais_metricas: ['Expansion: 15%', 'Contraction: 2%', 'LTV: R$ 24k']
  }
];

// Helper Functions
const getScoreBadgeClass = (score: number): string => {
  if (score >= 80) return 'bg-success text-success-foreground';
  if (score >= 60) return 'bg-warning text-warning-foreground';
  if (score >= 40) return 'bg-info text-info-foreground';
  return 'bg-destructive text-destructive-foreground';
};

const getTierBadgeClass = (tier: string): string => {
  const classes = {
    'Excelente': 'bg-success text-success-foreground',
    'Bom': 'bg-warning text-warning-foreground',
    'Regular': 'bg-info text-info-foreground',
    'Baixo': 'bg-destructive text-destructive-foreground'
  };
  return classes[tier as keyof typeof classes] || classes['Regular'];
};

const getRecomendacaoIcon = (recomendacao: Recomendacao): string => {
  const icons = {
    'Receita e Crescimento': '💰',
    'Eficiência e ROI': '🎯',
    'Saúde e Sustentabilidade': '💪',
    'Qualidade da Receita': '💎'
  };
  return icons[recomendacao.categoria as keyof typeof icons] || '💡';
};

// Custom Tooltip Component
const CustomRadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  
  return (
    <Card className="border-2 border-primary shadow-lg">
      <CardContent className="p-4">
        <p className="font-semibold mb-2">{data.categoria}</p>
        <p className="text-2xl font-bold text-primary mb-2">
          {data.valor}/100
        </p>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Principais métricas:
          </p>
          {data.principais_metricas.map((metrica: string, i: number) => (
            <p key={i} className="text-xs">• {metrica}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// FeatureRow Component
interface FeatureRowProps {
  label: string;
  value: string;
  peso: number; // 1-5
  icon: string;
  status?: 'success' | 'warning';
}

function FeatureRow({ label, value, peso, icon, status }: FeatureRowProps) {
  const renderStars = (weight: number) => {
    return '⭐'.repeat(weight);
  };
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">
            Peso: {renderStars(peso)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-semibold text-lg">{value}</p>
        {status && (
          <Badge 
            variant="outline"
            className={status === 'success' ? 'border-success text-success' : 'border-warning text-warning'}
          >
            {status === 'success' ? '✓' : '⚠'}
          </Badge>
        )}
      </div>
    </div>
  );
}

export default function MeuScore() {
  const [scoreData] = useState<ScoreBreakdown>(mockScoreData);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header com Score Principal */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Meu Score de Crédito</h1>
            <p className="text-muted-foreground mb-6">
              Entenda como avaliamos a saúde do seu negócio
            </p>
            
            {/* Score Hero Section */}
            <Card className="bg-gradient-to-r from-primary/20 to-info/20 border-2 border-primary">
              <CardContent className="py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Seu Score Atual</p>
                    <div className="flex items-baseline gap-4">
                      <span className="text-7xl font-bold text-primary">
                        {scoreData.score_total}
                      </span>
                      <span className="text-3xl text-muted-foreground">/100</span>
                    </div>
                    <Badge 
                      className={`mt-3 text-lg ${getTierBadgeClass(scoreData.tier)}`}
                    >
                      {scoreData.tier}
                    </Badge>
                  </div>
                  
                  {/* Mini indicadores */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Histórico</p>
                      <div className="flex items-center gap-2 justify-center">
                        <span className="text-2xl font-bold text-success">+{scoreData.variacao_mensal}</span>
                        <span className="text-success">↑</span>
                      </div>
                      <p className="text-xs text-muted-foreground">vs. mês anterior</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Ranking</p>
                      <p className="text-2xl font-bold text-info">Top {scoreData.ranking_percentil}%</p>
                      <p className="text-xs text-muted-foreground">da plataforma</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Layout Principal - Grid de 2 Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna 1: Radar Chart */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📊 Composição do Score
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Visualização multidimensional da saúde do seu SaaS
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid 
                        stroke="hsl(var(--muted))" 
                        strokeDasharray="3 3"
                      />
                      <PolarAngleAxis 
                        dataKey="categoria" 
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                        style={{ fontWeight: 500 }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Radar
                        name="Score"
                        dataKey="valor"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        strokeWidth={3}
                        dot={{ 
                          fill: 'hsl(var(--primary))', 
                          r: 6,
                          strokeWidth: 2,
                          stroke: 'hsl(var(--background))'
                        }}
                        activeDot={{ 
                          r: 8, 
                          fill: 'hsl(var(--primary))',
                          stroke: 'hsl(var(--background))',
                          strokeWidth: 3
                        }}
                      />
                      <Tooltip 
                        content={<CustomRadarTooltip />}
                        cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                  
                  {/* Legenda explicativa */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-3">
                      💡 <strong>Como ler o gráfico:</strong> Quanto mais próximo da borda externa, 
                      melhor a performance naquela categoria.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span>80-100: Excelente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning" />
                        <span>60-79: Bom</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-info" />
                        <span>40-59: Regular</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span>0-39: Crítico</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Coluna 2: Breakdown por Categoria */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔍 Detalhamento por Categoria
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Clique para ver as métricas que compõem cada categoria
                  </p>
                </CardHeader>
                
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {/* Categoria 1: Receita e Crescimento */}
                    <AccordionItem 
                      value="receita" 
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">💰</span>
                            <div className="text-left">
                              <p className="font-semibold">Receita e Crescimento</p>
                              <p className="text-sm text-muted-foreground">
                                MRR, ARR, NRR, Projeção de Churn
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getScoreBadgeClass(scoreData.categorias.receita_crescimento.score)}>
                              {scoreData.categorias.receita_crescimento.score}/100
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="pt-4">
                        <div className="space-y-3">
                          <Progress 
                            value={scoreData.categorias.receita_crescimento.score} 
                            className="h-2 mb-4"
                          />
                          
                          <div className="space-y-4">
                            <FeatureRow
                              label="MRR Atual"
                              value={formatCurrency(scoreData.categorias.receita_crescimento.features.mrr.valor)}
                              peso={scoreData.categorias.receita_crescimento.features.mrr.peso}
                              icon="💵"
                            />
                            <FeatureRow
                              label="ARR"
                              value={formatCurrency(scoreData.categorias.receita_crescimento.features.arr.valor)}
                              peso={scoreData.categorias.receita_crescimento.features.arr.peso}
                              icon="📈"
                            />
                            <FeatureRow
                              label="NRR (Net Revenue Retention)"
                              value={`${scoreData.categorias.receita_crescimento.features.nrr.valor}%`}
                              peso={scoreData.categorias.receita_crescimento.features.nrr.peso}
                              icon="🔄"
                              status={scoreData.categorias.receita_crescimento.features.nrr.valor > 100 ? 'success' : 'warning'}
                            />
                            <FeatureRow
                              label="Churn Projetado"
                              value={`${scoreData.categorias.receita_crescimento.features.churn_projetado.valor}%`}
                              peso={scoreData.categorias.receita_crescimento.features.churn_projetado.peso}
                              icon="�"
                              status={scoreData.categorias.receita_crescimento.features.churn_projetado.valor < 3 ? 'success' : 'warning'}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Categoria 2: Eficiência e ROI */}
                    <AccordionItem 
                      value="eficiencia" 
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🎯</span>
                            <div className="text-left">
                              <p className="font-semibold">Eficiência e ROI de Marketing</p>
                              <p className="text-sm text-muted-foreground">
                                CAC, CAC Payback, LTV:CAC, Magic Number
                              </p>
                            </div>
                          </div>
                          <Badge className={getScoreBadgeClass(scoreData.categorias.eficiencia_roi.score)}>
                            {scoreData.categorias.eficiencia_roi.score}/100
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="pt-4">
                        <Progress 
                          value={scoreData.categorias.eficiencia_roi.score} 
                          className="h-2 mb-4"
                        />
                        <div className="space-y-4">
                          <FeatureRow
                            label="CAC (Customer Acquisition Cost)"
                            value={formatCurrency(scoreData.categorias.eficiencia_roi.features.cac.valor)}
                            peso={scoreData.categorias.eficiencia_roi.features.cac.peso}
                            icon="💰"
                          />
                          <FeatureRow
                            label="CAC Payback (meses)"
                            value={`${scoreData.categorias.eficiencia_roi.features.cac_payback.valor} meses`}
                            peso={scoreData.categorias.eficiencia_roi.features.cac_payback.peso}
                            icon="⏱️"
                            status={scoreData.categorias.eficiencia_roi.features.cac_payback.valor < 12 ? 'success' : 'warning'}
                          />
                          <FeatureRow
                            label="LTV:CAC Ratio"
                            value={`${scoreData.categorias.eficiencia_roi.features.ltv_cac.valor}:1`}
                            peso={scoreData.categorias.eficiencia_roi.features.ltv_cac.peso}
                            icon="⚖️"
                            status={scoreData.categorias.eficiencia_roi.features.ltv_cac.valor > 3 ? 'success' : 'warning'}
                          />
                          <FeatureRow
                            label="Magic Number"
                            value={scoreData.categorias.eficiencia_roi.features.magic_number.valor.toFixed(2)}
                            peso={scoreData.categorias.eficiencia_roi.features.magic_number.peso}
                            icon="✨"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Categoria 3: Saúde e Sustentabilidade */}
                    <AccordionItem 
                      value="saude" 
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">💪</span>
                            <div className="text-left">
                              <p className="font-semibold">Saúde e Sustentabilidade</p>
                              <p className="text-sm text-muted-foreground">
                                Burn Multiple, Runway, DSCR
                              </p>
                            </div>
                          </div>
                          <Badge className={getScoreBadgeClass(scoreData.categorias.saude_sustentabilidade.score)}>
                            {scoreData.categorias.saude_sustentabilidade.score}/100
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="pt-4">
                        <Progress 
                          value={scoreData.categorias.saude_sustentabilidade.score} 
                          className="h-2 mb-4"
                        />
                        <div className="space-y-4">
                          <FeatureRow
                            label="Burn Multiple"
                            value={scoreData.categorias.saude_sustentabilidade.features.burn_multiple.valor.toFixed(2)}
                            peso={scoreData.categorias.saude_sustentabilidade.features.burn_multiple.peso}
                            icon="🔥"
                            status={scoreData.categorias.saude_sustentabilidade.features.burn_multiple.valor < 2 ? 'success' : 'warning'}
                          />
                          <FeatureRow
                            label="Runway (meses de caixa)"
                            value={`${scoreData.categorias.saude_sustentabilidade.features.runway.valor} meses`}
                            peso={scoreData.categorias.saude_sustentabilidade.features.runway.peso}
                            icon="🛤️"
                            status={scoreData.categorias.saude_sustentabilidade.features.runway.valor > 12 ? 'success' : 'warning'}
                          />
                          <FeatureRow
                            label="DSCR Projetado"
                            value={scoreData.categorias.saude_sustentabilidade.features.dscr.valor.toFixed(2)}
                            peso={scoreData.categorias.saude_sustentabilidade.features.dscr.peso}
                            icon="📊"
                            status={scoreData.categorias.saude_sustentabilidade.features.dscr.valor > 1.25 ? 'success' : 'warning'}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Categoria 4: Qualidade da Receita */}
                    <AccordionItem 
                      value="qualidade" 
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">💎</span>
                            <div className="text-left">
                              <p className="font-semibold">Qualidade da Receita</p>
                              <p className="text-sm text-muted-foreground">
                                Expansion, Contraction, Cohort LTV, Upsell/Downsell
                              </p>
                            </div>
                          </div>
                          <Badge className={getScoreBadgeClass(scoreData.categorias.qualidade_receita.score)}>
                            {scoreData.categorias.qualidade_receita.score}/100
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="pt-4">
                        <Progress 
                          value={scoreData.categorias.qualidade_receita.score} 
                          className="h-2 mb-4"
                        />
                        <div className="space-y-4">
                          <FeatureRow
                            label="Expansion %"
                            value={`${scoreData.categorias.qualidade_receita.features.expansion_pct.valor}%`}
                            peso={scoreData.categorias.qualidade_receita.features.expansion_pct.peso}
                            icon="📈"
                            status="success"
                          />
                          <FeatureRow
                            label="Contraction %"
                            value={`${scoreData.categorias.qualidade_receita.features.contraction_pct.valor}%`}
                            peso={scoreData.categorias.qualidade_receita.features.contraction_pct.peso}
                            icon="📉"
                            status={scoreData.categorias.qualidade_receita.features.contraction_pct.valor < 3 ? 'success' : 'warning'}
                          />
                          <FeatureRow
                            label="Cohort LTV"
                            value={formatCurrency(scoreData.categorias.qualidade_receita.features.cohort_ltv.valor)}
                            peso={scoreData.categorias.qualidade_receita.features.cohort_ltv.peso}
                            icon="👥"
                          />
                          <FeatureRow
                            label="Upsell/Downsell Ratio"
                            value={scoreData.categorias.qualidade_receita.features.upsell_downsell.valor.toFixed(2)}
                            peso={scoreData.categorias.qualidade_receita.features.upsell_downsell.peso}
                            icon="⬆️"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Seção 3: Recomendações (Full Width) */}
          <Card className="mt-8 bg-info/5 border-info/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💡 Recomendações para Melhorar seu Score
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {scoreData.recomendacoes.map((recomendacao, index) => (
                  <Alert key={index} className="bg-background">
                    <AlertDescription className="flex items-start gap-3">
                      <span className="text-xl mt-1">{getRecomendacaoIcon(recomendacao)}</span>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{recomendacao.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          {recomendacao.descricao}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Impacto: +{recomendacao.impacto_estimado} pontos
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Categoria: {recomendacao.categoria}
                          </Badge>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Dica:</strong> Priorize as ações com maior impacto estimado e 
                  foque nas categorias onde seu score está mais baixo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}