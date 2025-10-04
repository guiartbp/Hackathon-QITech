"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { ValueInput } from '@/components/wizard/ValueInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/format';

export default function Step1Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [limiteMax, setLimiteMax] = useState(500000);
  const [scoreAtual, setScoreAtual] = useState(750);
  const [mrrAtual, setMrrAtual] = useState(85000);
  const [crescimentoMrr, setCrescimentoMrr] = useState(2.1);
  const [percentualMrr, setPercentualMrr] = useState(4.2);
  const [multiplicoCap, setMultiplicoCap] = useState(1.28);
  const [valorSolicitado, setValorSolicitado] = useState(50000);
  const [proposito, setProposito] = useState('');
  const [detalhamento, setDetalhamento] = useState('');

  useEffect(() => {
    async function fetchDadosTomador() {
      try {
        // Mock API call - replace with actual endpoint
        // const response = await fetch('/api/tomadores/me/perfil-completo');
        // const data = await response.json();
        
        // Mock data simulating real SaaS metrics
        const data = {
          limite_maximo: 500000,
          score: 750,
          mrr_atual: 85000,
          crescimento_mrr_mensal: 2.1, // 2.1% growth per month
          percentual_mrr_ofertado: 4.2, // 4.2% of MRR as payment
          multiplo_cap: 1.28 // 1.28x multiplier
        };
        
        setLimiteMax(data.limite_maximo);
        setScoreAtual(data.score);
        setMrrAtual(data.mrr_atual);
        setCrescimentoMrr(data.crescimento_mrr_mensal);
        setPercentualMrr(data.percentual_mrr_ofertado);
        setMultiplicoCap(data.multiplo_cap);
        
        // Load saved data if exists
        const savedData = localStorage.getItem('wizardData');
        if (savedData) {
          const { valorSolicitado: saved_valor, proposito: saved_proposito, detalhamento: saved_detalhamento } = JSON.parse(savedData);
          setValorSolicitado(saved_valor || 50000);
          setProposito(saved_proposito || '');
          setDetalhamento(saved_detalhamento || '');
        } else {
          setValorSolicitado(50000);
        }
        
      } catch (error) {
        toast.error('Erro ao carregar informações');
        console.error('Error fetching tomador data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDadosTomador();
  }, []);

  const handleNext = async () => {
    // Validate inputs
    if (valorSolicitado < 50000 || valorSolicitado > limiteMax) {
      toast.error('Valor fora do limite permitido');
      return;
    }
    
    if (!proposito) {
      toast.error('Selecione o propósito do capital');
      return;
    }
    
    // Save to localStorage
    const wizardData = {
      valorSolicitado,
      proposito,
      detalhamento,
      limiteMax,
      scoreAtual,
      mrrAtual,
      crescimentoMrr,
      percentualMrr,
      multiplicoCap
    };
    
    localStorage.setItem('wizardData', JSON.stringify(wizardData));
    
    // Navigate to next step
    router.push('/to/solicitar-credito/step-2');
  };

  if (loading) {
    return (
      <WizardLayout currentStep={1} totalSteps={4}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Carregando informações...</span>
        </div>
      </WizardLayout>
    );
  }

  return (
    <WizardLayout currentStep={1} totalSteps={4}>
      
      {/* Breadcrumb */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => router.push('/to/minhas_dividas')}
        className="mb-6 gap-2"
      >
        ← Voltar para Minhas Dívidas
      </Button>
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Revenue Based Funding</h1>
        <p className="text-muted-foreground">
          Capital flexível baseado na sua receita recorrente (MRR)
        </p>
      </div>

      {/* RBF Model Explanation */}
      <Card className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold mb-2">Como funciona o RBF?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">✅ Pagamento Flexível</p>
                  <p>Você paga uma % do seu MRR, não parcelas fixas</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">✅ Sem Diluição</p>
                  <p>Zero equity - você mantém 100% da sua empresa</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">✅ Cresce com Você</p>
                  <p>Se o MRR cresce, pagamento cresce proporcionalmente</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">✅ Protege no Downturn</p>
                  <p>Se o MRR cai, o pagamento também diminui</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Input de Valor */}
      <Card>
        <CardHeader>
          <CardTitle>Quanto você precisa?</CardTitle>
          <p className="text-muted-foreground">
            Baseado no seu MRR e score, você pode solicitar até {formatCurrency(limiteMax)}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current MRR Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">MRR Atual</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(mrrAtual)}</p>
            </div>
            <div className="text-center p-4 bg-green-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Crescimento/Mês</p>
              <p className="text-2xl font-bold text-green-500">+{crescimentoMrr.toFixed(1)}%</p>
            </div>
            <div className="text-center p-4 bg-blue-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Score</p>
              <p className="text-2xl font-bold text-blue-500">{scoreAtual}</p>
            </div>
          </div>

          {/* Value Input with increment/decrement */}
          <ValueInput
            value={valorSolicitado}
            onChange={setValorSolicitado}
            min={50000}
            max={limiteMax}
            step={10000}
          />
          
          {/* Slider */}
          <div className="px-4">
            <Slider 
              value={[valorSolicitado]}
              onValueChange={([v]) => setValorSolicitado(v)}
              min={50000}
              max={limiteMax}
              step={10000}
              className="mt-6"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formatCurrency(50000)}</span>
              <span>{formatCurrency(limiteMax)}</span>
            </div>
          </div>
          
          {/* RBF Preview */}
          <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📊</span>
              <h4 className="font-semibold">Prévia RBF</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Pagamento estimado/mês:</p>
                <p className="font-semibold text-lg">
                  ~{formatCurrency((mrrAtual * percentualMrr) / 100)} 
                  <span className="text-xs text-muted-foreground ml-1">({percentualMrr.toFixed(1)}% do MRR)</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Múltiplo Cap:</p>
                <p className="font-semibold text-lg text-green-500">
                  {multiplicoCap.toFixed(2)}x 
                  <span className="text-xs text-muted-foreground ml-1">(máximo a pagar)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Limit Information */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Seu limite foi calculado baseado no seu MRR atual ({formatCurrency(mrrAtual)}), 
              score ({scoreAtual}) e métricas de crescimento (+{crescimentoMrr.toFixed(1)}%/mês) do seu SaaS.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Purpose Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Para que você vai usar esse capital?</CardTitle>
        </CardHeader>
        
        <CardContent>
          <RadioGroup value={proposito} onValueChange={setProposito}>
            <div className="space-y-3">
              <Label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="marketing" />
                <div>
                  <p className="font-semibold">📢 Marketing e Aquisição</p>
                  <p className="text-sm text-muted-foreground">
                    Campanhas, ads, SEO, tráfego pago
                  </p>
                </div>
              </Label>
              
              <Label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="contratacoes" />
                <div>
                  <p className="font-semibold">👥 Contratações</p>
                  <p className="text-sm text-muted-foreground">
                    Expandir time de dev, vendas, suporte
                  </p>
                </div>
              </Label>
              
              <Label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="infraestrutura" />
                <div>
                  <p className="font-semibold">☁️ Infraestrutura</p>
                  <p className="text-sm text-muted-foreground">
                    AWS, servidores, ferramentas, segurança
                  </p>
                </div>
              </Label>
              
              <Label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="produto" />
                <div>
                  <p className="font-semibold">🛠️ Desenvolvimento de Produto</p>
                  <p className="text-sm text-muted-foreground">
                    Novas features, integrações, melhorias
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          {/* Details textarea */}
          <div className="mt-6">
            <Label>Detalhe como você pretende usar o capital (opcional)</Label>
            <Textarea 
              placeholder="Ex: 60% em anúncios no LinkedIn, 30% em criação de conteúdo, 10% em ferramentas de analytics..."
              value={detalhamento}
              onChange={(e) => setDetalhamento(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push('/to/minhas_dividas')}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!valorSolicitado || !proposito}
        >
          Continuar →
        </Button>
      </div>
      
    </WizardLayout>
  );
}