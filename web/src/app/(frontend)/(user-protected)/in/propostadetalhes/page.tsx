"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MetricCard } from '@/components/detalhes/MetricCard';
import { InfoRow } from '@/components/detalhes/InfoRow';
import { MetricRow } from '@/components/detalhes/MetricRow';
import { LineChartComponent } from '@/components/detalhes/LineChartComponent';
import { getPropostaById } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/format';
import { ArrowLeft, ExternalLink, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function PropostaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();
  const [valorInvestimento, setValorInvestimento] = useState(1000);
  const [metodoPagamento, setMetodoPagamento] = useState('pix');

  const proposta = id ? getPropostaById(id) : undefined;

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const numValue = parseInt(value) || 0;
    if (numValue <= 15000) {
      setValorInvestimento(numValue);
    }
  };

  const incrementValor = () => {
    if (valorInvestimento < 15000) {
      setValorInvestimento(prev => Math.min(prev + 100, 15000));
    }
  };

  const decrementValor = () => {
    if (valorInvestimento > 100) {
      setValorInvestimento(prev => Math.max(prev - 100, 100));
    }
  };

  if (!proposta) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Proposta não encontrada</h2>
            <Button onClick={() => navigate.push('/marketplace')}>
              Voltar ao Marketplace
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleConfirmar = () => {
    toast.success('Investimento confirmado com sucesso!', {
      description: `Você investiu ${formatCurrency(valorInvestimento)} em ${proposta.nome}`
    });
  };

  const getHealthBadge = (score: number) => {
    if (score >= 85) return 'bg-success text-success-foreground';
    if (score >= 75) return 'bg-warning text-warning-foreground';
    return 'bg-info text-info-foreground';
  };

  const retornoTotal = valorInvestimento * (proposta.contrato.rendimento / 100 + 1);
  const lucro = valorInvestimento * (proposta.contrato.rendimento / 100);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate.push('/marketplace')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Card */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-5xl">{proposta.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl mb-2">{proposta.nome}</CardTitle>
                          <a 
                            href={proposta.website} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {proposta.website} 
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <Badge variant="outline" className="text-lg border-2">
                          Score {proposta.score}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Description */}
                  <Alert className="bg-info/10 border-info/20">
                    <AlertTitle className="font-semibold mb-2">Descrição:</AlertTitle>
                    <AlertDescription className="text-sm leading-relaxed">
                      {proposta.descricao}
                    </AlertDescription>
                  </Alert>
                  
                  <Separator />
                  
                  {/* Contract Terms */}
                  <div>
                    <h3 className="font-semibold mb-4">Termos do Contrato</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <MetricCard
                        label="Total da dívida"
                        value={formatCurrency(proposta.contrato.totalDivida)}
                        variant="neutral"
                      />
                      <MetricCard
                        label="Rendimento"
                        value={`${proposta.contrato.rendimento}% a.a.`}
                        variant="purple"
                      />
                      <MetricCard
                        label="Duração"
                        value={`${proposta.contrato.duracao} meses`}
                        variant="neutral"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Funding Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-muted-foreground">Progresso do Funding</span>
                      <span className="font-semibold text-primary text-lg">
                        {proposta.contrato.progressoFunding}%
                      </span>
                    </div>
                    <Progress 
                      value={proposta.contrato.progressoFunding} 
                      className="h-3 mb-3"
                    />
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(proposta.contrato.valorFinanciado)}
                      </span>
                      <span className="text-muted-foreground">
                        / {formatCurrency(proposta.contrato.totalDivida)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* About SaaS Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      🏢 Sobre o SaaS
                    </CardTitle>
                    <Badge className={getHealthBadge(proposta.score)}>
                      {proposta.scoreLabel}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow label="Setor" value={proposta.setor} />
                    <InfoRow label="Criação" value={formatDate(proposta.criacao)} />
                    <InfoRow 
                      label="Histórico" 
                      value={`${proposta.emprestimosQuitados} empréstimos quitados`}
                      icon="✓"
                    />
                  </div>
                  
                  {/* Description Accordion */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="descricao">
                      <AccordionTrigger>Descrição Completa</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm leading-relaxed">
                          {proposta.descricaoCompleta}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Separator />
                  
                  {/* Business Metrics */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      📊 Métricas do Negócio
                    </h4>
                    <div className="space-y-3">
                      <MetricRow 
                        label="MRR Atual" 
                        value={formatCurrency(proposta.metricas.mrr)}
                        icon="💰"
                        tooltip="Monthly Recurring Revenue - Receita recorrente mensal"
                      />
                      <MetricRow 
                        label="Churn" 
                        value={`${proposta.metricas.churn.toFixed(1)}%`}
                        icon="📉"
                        tooltip="Taxa de cancelamento de clientes"
                        status={proposta.metricas.churn < 3 ? 'success' : 'warning'}
                      />
                      <MetricRow 
                        label="Runway" 
                        value={`${proposta.metricas.runway} meses`}
                        icon="⏱️"
                        tooltip="Meses de caixa disponível"
                      />
                      <MetricRow 
                        label="LTV" 
                        value={formatCurrency(proposta.metricas.ltv)}
                        icon="💎"
                        tooltip="Lifetime Value - Valor total do cliente"
                      />
                      <MetricRow 
                        label="CAC" 
                        value={formatCurrency(proposta.metricas.cac)}
                        icon="🎯"
                        tooltip="Customer Acquisition Cost - Custo de aquisição"
                      />
                      <MetricRow 
                        label="Número de clientes" 
                        value={proposta.metricas.numClientes}
                        icon="👥"
                      />
                      <MetricRow 
                        label="Ticket Médio" 
                        value={formatCurrency(proposta.metricas.ticketMedio)}
                        icon="🎫"
                        tooltip="Valor médio por cliente"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Evolution Charts */}
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-semibold mb-4">Evolução do ARR</h5>
                      <div className="bg-chart-bg rounded-lg p-4">
                        <LineChartComponent
                          data={proposta.evolucaoARR}
                          xKey="mes"
                          yKey="valor"
                          height={200}
                          color="hsl(var(--primary))"
                          darkMode
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold mb-4 text-sm">Evolução do MRR</h5>
                        <div className="bg-background rounded-lg border p-2">
                          <LineChartComponent
                            data={proposta.evolucaoMRR}
                            xKey="mes"
                            yKey="valor"
                            height={150}
                            color="hsl(var(--purple))"
                          />
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-4 text-sm">
                          Evolução do nº de clientes
                        </h5>
                        <div className="bg-background rounded-lg border p-2">
                          <LineChartComponent
                            data={proposta.evolucaoClientes}
                            xKey="mes"
                            yKey="quantidade"
                            height={150}
                            color="hsl(var(--purple))"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Investment Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-2 border-primary">
                <CardHeader className="text-center pb-4">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-4">Valor de Investimento</p>
                    
                    {/* Investment Amount Input */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={decrementValor}
                          disabled={valorInvestimento <= 100}
                          className="h-10 w-10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <div className="relative">
                          <input
                            type="text"
                            value={valorInvestimento.toLocaleString('pt-BR')}
                            onChange={handleValorChange}
                            className="w-32 h-12 text-center text-2xl font-bold border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                            placeholder="1.000"
                          />
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                            R$
                          </span>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={incrementValor}
                          disabled={valorInvestimento >= 15000}
                          className="h-10 w-10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <Separator />
                  
                  {/* Payment Method */}
                  <div>
                    <label className="block font-semibold mb-3">
                      Método de Pagamento
                    </label>
                    <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">
                          💰 Transferência Bancária (PIX)
                        </SelectItem>
                        <SelectItem value="carteira">
                          💳 Débito da Carteira
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  {/* Return Projection */}
                  <Alert className="bg-success/10 border-success/20">
                    <AlertTitle className="font-semibold mb-2">
                      📊 Retorno Estimado
                    </AlertTitle>
                    <AlertDescription>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Investimento:</span>
                          <span className="font-semibold">
                            {formatCurrency(valorInvestimento)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Retorno Total:</span>
                          <span className="font-semibold text-success">
                            {formatCurrency(retornoTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lucro:</span>
                          <span className="font-semibold text-success">
                            +{formatCurrency(lucro)}
                          </span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  {/* CTA */}
                  <Button 
                    size="lg" 
                    className="w-full text-lg py-6"
                    onClick={handleConfirmar}
                  >
                    Confirmar Investimento
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Ao confirmar, você concorda com os{' '}
                    <a href="/termos" className="underline hover:text-primary">
                      Termos de Investimento
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
