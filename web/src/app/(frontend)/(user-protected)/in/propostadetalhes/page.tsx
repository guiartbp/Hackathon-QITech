"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatCurrency, formatDate } from '@/lib/format';
import { ArrowLeft, ExternalLink, Minus, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Interface para os dados da proposta da API
interface PropostaAPI {
  id: string;
  empresaId: string;
  valorSolicitado: number;
  multiploCap: number;
  percentualMrr: number;
  duracaoMeses: number;
  valorMinimoFunding?: number;
  planoUsoFundos?: string;
  statusFunding: string;
  valorFinanciado: number;
  progressoFunding: number;
  dataAbertura?: string;
  dataFechamento?: string;
  diasAberta?: number;
  scoreNaAbertura?: number;
  criadoEm: string;
  atualizadoEm: string;
  empresa: {
    id: string;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia?: string;
    website?: string;
    segmento?: string;
    setor?: string;
    estagioInvestimento?: string;
    descricaoCurta?: string;
    descricaoCompleta?: string;
    produto?: string;
    dataFundacao?: string;
    numeroFuncionarios?: number;
    emoji?: string;
    tomador?: {
      nomeCompleto: string;
      email: string;
    };
  };
  investimentos?: Array<{
    id: string;
    valorAportado: number;
    statusInvestimento: string;
  }>;
  contrato?: {
    id: string;
    valorPrincipal: number;
    statusContrato: string;
  } | null;
}

export default function PropostaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();
  const [valorInvestimento, setValorInvestimento] = useState(1000);
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [proposta, setProposta] = useState<PropostaAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados da proposta via API
  useEffect(() => {
    const fetchProposta = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/propostas/${id}`);
        
        if (!response.ok) {
          throw new Error('Proposta não encontrada');
        }
        
        const data = await response.json();
        setProposta(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar proposta');
      } finally {
        setLoading(false);
      }
    };

    fetchProposta();
  }, [id]);

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

  // Estados de loading e erro
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>Carregando proposta...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !proposta) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">
              {error || 'Proposta não encontrada'}
            </h2>
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
      description: `Você investiu ${formatCurrency(valorInvestimento)} na ${proposta.empresa.razaoSocial}`
    });
  };

  const getHealthBadge = (score: number) => {
    if (score >= 85) return 'bg-success text-success-foreground';
    if (score >= 75) return 'bg-warning text-warning-foreground';
    return 'bg-info text-info-foreground';
  };

  // Calcular retorno baseado no múltiplo CAP
  const rendimentoCalculado = (proposta.multiploCap - 1) * 100; // Converte múltiplo em percentual
  const retornoTotal = valorInvestimento * proposta.multiploCap;
  const lucro = valorInvestimento * (proposta.multiploCap - 1);

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
                    <span className="text-5xl">{proposta.empresa.emoji || '🏢'}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl mb-2">
                            {proposta.empresa.nomeFantasia || proposta.empresa.razaoSocial}
                          </CardTitle>
                          {proposta.empresa.website && (
                            <a 
                              href={proposta.empresa.website} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              {proposta.empresa.website} 
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <Badge variant="outline" className="text-lg border-2">
                          Score {proposta.scoreNaAbertura || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Description */}
                  {proposta.empresa.descricaoCurta && (
                    <>
                      <Alert className="bg-info/10 border-info/20">
                        <AlertTitle className="font-semibold mb-2">Descrição:</AlertTitle>
                        <AlertDescription className="text-sm leading-relaxed">
                          {proposta.empresa.descricaoCurta}
                        </AlertDescription>
                      </Alert>
                      <Separator />
                    </>
                  )}
                  
                  {/* Contract Terms */}
                  <div>
                    <h3 className="font-semibold mb-4">Termos da Proposta</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard
                        label="Valor solicitado"
                        value={formatCurrency(proposta.valorSolicitado)}
                        variant="neutral"
                      />
                      <MetricCard
                        label="Múltiplo CAP"
                        value={`${proposta.multiploCap.toFixed(2)}x`}
                        variant="purple"
                      />
                      <MetricCard
                        label="Rendimento"
                        value={`${rendimentoCalculado.toFixed(1)}%`}
                        variant="orange"
                      />
                      <MetricCard
                        label="Duração"
                        value={`${proposta.duracaoMeses} meses`}
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
                        {proposta.progressoFunding.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={proposta.progressoFunding} 
                      className="h-3 mb-3"
                    />
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(proposta.valorFinanciado)}
                      </span>
                      <span className="text-muted-foreground">
                        / {formatCurrency(proposta.valorSolicitado)}
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
                      🏢 Sobre a Empresa
                    </CardTitle>
                    {proposta.scoreNaAbertura && (
                      <Badge className={getHealthBadge(proposta.scoreNaAbertura)}>
                        Score: {proposta.scoreNaAbertura}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow 
                      label="CNPJ" 
                      value={proposta.empresa.cnpj} 
                    />
                    <InfoRow 
                      label="Razão Social" 
                      value={proposta.empresa.razaoSocial} 
                    />
                    {proposta.empresa.segmento && (
                      <InfoRow 
                        label="Segmento" 
                        value={proposta.empresa.segmento} 
                      />
                    )}
                    {proposta.empresa.setor && (
                      <InfoRow 
                        label="Setor" 
                        value={proposta.empresa.setor} 
                      />
                    )}
                    {proposta.empresa.dataFundacao && (
                      <InfoRow 
                        label="Data de Fundação" 
                        value={formatDate(proposta.empresa.dataFundacao)} 
                      />
                    )}
                    {proposta.empresa.numeroFuncionarios && (
                      <InfoRow 
                        label="Funcionários" 
                        value={`${proposta.empresa.numeroFuncionarios} funcionários`}
                        icon="👥"
                      />
                    )}
                  </div>
                  
                  {/* Description Accordion */}
                  {proposta.empresa.descricaoCompleta && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="descricao">
                        <AccordionTrigger>Descrição Completa</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm leading-relaxed">
                            {proposta.empresa.descricaoCompleta}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  
                  <Separator />
                  
                  {/* Proposal Details */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      � Detalhes da Proposta
                    </h4>
                    <div className="space-y-3">
                      <MetricRow 
                        label="Status" 
                        value={proposta.statusFunding}
                        icon="�"
                      />
                      <MetricRow 
                        label="Percentual MRR" 
                        value={`${proposta.percentualMrr.toFixed(1)}%`}
                        icon="�"
                        tooltip="Percentual do MRR comprometido"
                      />
                      {proposta.valorMinimoFunding && (
                        <MetricRow 
                          label="Valor Mínimo" 
                          value={formatCurrency(proposta.valorMinimoFunding)}
                          icon="🎯"
                          tooltip="Valor mínimo de funding"
                        />
                      )}
                      {proposta.dataAbertura && (
                        <MetricRow 
                          label="Data de Abertura" 
                          value={formatDate(proposta.dataAbertura)}
                          icon="📅"
                        />
                      )}
                      {proposta.diasAberta && (
                        <MetricRow 
                          label="Dias em Aberto" 
                          value={`${proposta.diasAberta} dias`}
                          icon="⏱️"
                        />
                      )}
                      {proposta.planoUsoFundos && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <h5 className="font-medium mb-2">Plano de Uso dos Fundos:</h5>
                          <p className="text-sm text-muted-foreground">
                            {proposta.planoUsoFundos}
                          </p>
                        </div>
                      )}
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
