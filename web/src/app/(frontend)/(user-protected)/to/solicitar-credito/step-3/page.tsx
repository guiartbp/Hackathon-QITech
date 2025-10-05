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
      
      // API call para simulação
      const response = await fetch('/api/simulacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor_solicitado: valorSolicitado })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar simulação');
      }

      const data = await response.json();

      setSimulation(data);
      
      // Save simulation to wizard data
      const currentData = JSON.parse(localStorage.getItem('wizardData') || '{}');
      currentData.simulation = data;
      localStorage.setItem('wizardData', JSON.stringify(currentData));
      
    } catch (error) {
      console.error('Erro ao buscar simulação:', error);
      toast.error('Erro ao gerar simulação. Tente novamente.');
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