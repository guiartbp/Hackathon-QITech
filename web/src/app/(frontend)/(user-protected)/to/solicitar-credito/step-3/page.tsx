"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { SimulationResult } from '@/components/wizard/SimulationResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/format';

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

interface WizardData {
  valorSolicitado: number;
  connections: string[];
  scoreAtual: number;
  simulation?: SimulationData;
}

export default function Step3Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [wizardData, setWizardData] = useState<WizardData | null>(null);

  useEffect(() => {
    // Check if user came from previous steps
    const savedData = localStorage.getItem('wizardData');
    if (!savedData) {
      router.push('/to/solicitar-credito/step-1');
      return;
    }

    const data = JSON.parse(savedData);
    if (!data.connections || data.connections.length === 0) {
      router.push('/to/solicitar-credito/step-2');
      return;
    }

    setWizardData(data);
    fetchSimulation(data.valorSolicitado);
  }, [router]);

  const fetchSimulation = async (valorSolicitado: number) => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual endpoint
      // const response = await fetch('/api/simulacao', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ valor_solicitado: valorSolicitado })
      // });
      // const data = await response.json();

      // Mock simulation data for RBF
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // RBF Parameters based on score and amount
      const mrrAtual = 85000; // Mock current MRR: R$ 85k/month
      const percentualMrr = 4.2; // 4.2% of MRR per month
      const multiplicoCap = 1.28; // 1.28x multiplier cap
      
      const valorTotalRetorno = valorSolicitado * multiplicoCap;
      const custoTotal = valorTotalRetorno - valorSolicitado;

      // Generate projections for 3 scenarios
      const cenarios = [
        { nome: 'conservador', crescimento: 0.5 }, // 0.5% MRR growth per month
        { nome: 'base', crescimento: 2.0 },        // 2% MRR growth per month  
        { nome: 'otimista', crescimento: 4.0 }     // 4% MRR growth per month
      ];

      const projecoes = cenarios.map(cenario => {
        const cronograma = [];
        let mrrProjetado = mrrAtual;
        let acumuladoPago = 0;
        let mes = 1;

        while (acumuladoPago < valorTotalRetorno && mes <= 60) { // Max 5 years
          const valorParcela = mrrProjetado * (percentualMrr / 100);
          acumuladoPago = Math.min(acumuladoPago + valorParcela, valorTotalRetorno);
          const saldoRestante = valorTotalRetorno - acumuladoPago;

          const dataVencimento = new Date();
          dataVencimento.setMonth(dataVencimento.getMonth() + mes);

          cronograma.push({
            mes,
            data: dataVencimento.toLocaleDateString('pt-BR'),
            mrr_projetado: mrrProjetado,
            valor_parcela: valorParcela,
            acumulado_pago: acumuladoPago,
            saldo_restante: Math.max(0, saldoRestante)
          });

          // Update MRR for next month
          mrrProjetado *= (1 + cenario.crescimento / 100);
          mes++;

          if (saldoRestante <= 0) break;
        }

        return {
          cenario: cenario.nome as 'conservador' | 'base' | 'otimista',
          crescimento_mrr_mensal: cenario.crescimento,
          prazo_estimado_meses: cronograma.length,
          cronograma
        };
      });

      const mockSimulation: SimulationData = {
        valor_solicitado: valorSolicitado,
        multiplo_cap: multiplicoCap,
        percentual_mrr: percentualMrr,
        mrr_atual: mrrAtual,
        valor_total_retorno: valorTotalRetorno,
        custo_total: custoTotal,
        primeira_parcela: projecoes[1].cronograma[0].data, // Use base scenario
        projecoes
      };

      setSimulation(mockSimulation);
      
    } catch (error) {
      toast.error('Erro ao carregar simulação');
      console.error('Simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!simulation) {
      toast.error('Simulação não encontrada');
      return;
    }

    // Save simulation data
    const updatedWizardData = {
      ...wizardData,
      simulation
    };
    localStorage.setItem('wizardData', JSON.stringify(updatedWizardData));

    router.push('/to/solicitar-credito/step-4');
  };

  const handleBack = () => {
    router.push('/to/solicitar-credito/step-2');
  };

  if (loading || !wizardData) {
    return (
      <WizardLayout currentStep={3} totalSteps={4}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Calculando simulação...</span>
        </div>
      </WizardLayout>
    );
  }

  return (
    <WizardLayout currentStep={3} totalSteps={4}>
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Simulação de Termos</h1>
        <p className="text-muted-foreground">
          Confira as condições propostas para seu empréstimo
        </p>
      </div>

      {/* Request Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo da Solicitação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Valor Solicitado</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(wizardData.valorSolicitado)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Score Atual</p>
              <p className="text-2xl font-bold">
                {wizardData.scoreAtual}
              </p>
            </div>
            <div className="text-center p-4 bg-green-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">APIs Conectadas</p>
              <div className="flex justify-center gap-1 mt-2">
                {wizardData.connections.map((conn: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {conn}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Result */}
      {simulation && (
        <SimulationResult 
          simulation={simulation} 
          loading={loading}
        />
      )}

      {/* Terms & Conditions Notice */}
      <Card className="mt-6 bg-yellow-500/5 border-yellow-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h4 className="font-semibold mb-2">Importante sobre os Termos</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Esta é uma simulação baseada no seu perfil atual</li>
                <li>• Os termos finais podem variar após análise detalhada</li>
                <li>• Investidores poderão fazer ofertas com condições diferentes</li>
                <li>• Você poderá escolher a melhor proposta recebida</li>
                <li>• Taxa de abertura de crédito: isenta</li>
                <li>• Sem multa por pagamento antecipado</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          ← Voltar
        </Button>
        <Button onClick={handleNext}>
          Aceitar Condições →
        </Button>
      </div>
      
    </WizardLayout>
  );
}