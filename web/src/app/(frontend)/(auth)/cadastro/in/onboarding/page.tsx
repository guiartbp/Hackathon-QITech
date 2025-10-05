"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, Target } from 'lucide-react';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { onboardingStorage } from '@/lib/onboardingStorage';

interface Step7Data {
  estrategia_investimento: 'ia' | 'picking';
}

export default function CadastroOnboarding() {
  const router = useRouter();
  const [estrategia, setEstrategia] = useState<'ia' | 'picking' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Proteção de rota
  useEffect(() => {
    if (!onboardingStorage.validateStepAccess(7)) {
      router.push('/cadastro/in/nome');
      return;
    }

    // Carregar dados salvos
    const saved = onboardingStorage.getStep(7) as Step7Data | null;
    if (saved) {
      setEstrategia(saved.estrategia_investimento);
    }
  }, [router]);

  const handleFinalizar = async () => {
    if (!estrategia) {
      toast.error('Selecione uma estratégia de investimento');
      return;
    }

    setSubmitting(true);

    try {
      // Salvar step atual
      const stepData: Step7Data = {
        estrategia_investimento: estrategia
      };
      onboardingStorage.saveStep(7, stepData);

      // Coletar todos os dados do onboarding
      const allData = onboardingStorage.getAllSteps();

      // 1. Enviar dados do investidor para API
      const response = await fetch('/api/onboarding/investor/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_pessoa: allData.step1?.tipo_pessoa,
          nome_razao_social: allData.step1?.nome_razao_social,
          documento_identificacao: allData.step3?.documento_identificacao,
          patrimonio_liquido: allData.step5?.patrimonio_liquido,
          declaracao_risco: allData.step5?.declaracao_risco,
          experiencia_ativos_risco: allData.step5?.experiencia_ativos_risco,
          modelo_investimento: estrategia,
          fonte_recursos: null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar dados no banco');
      }

      // 2. Criar wallet automaticamente com saldo R$ 0
      const walletResponse = await fetch('/api/wallets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!walletResponse.ok) {
        console.error('Erro ao criar wallet, mas continuando...');
        // Não bloqueia o fluxo se a wallet falhar
      } else {
        const walletData = await walletResponse.json();
        console.log('Wallet criada:', walletData);
      }

      toast.success('Cadastro e carteira criados com sucesso! 🎉');

      // Limpar dados do localStorage
      onboardingStorage.clearAll();

      // Redirecionar baseado na estratégia
      if (estrategia === 'ia') {
        router.push('/cadastro/in/sucesso?strategy=ia');
      } else {
        router.push('/cadastro/in/sucesso?strategy=picking');
      }

    } catch (error) {
      console.error('Erro ao finalizar cadastro:', error);
      toast.error('Erro ao enviar cadastro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Finalizando seu cadastro...</h2>
          <p className="text-muted-foreground">Isso pode levar alguns segundos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <OnboardingProgress currentStep={7} totalSteps={7} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">Escolha sua estratégia 🎯</h1>
          <p className="text-xl text-muted-foreground">
            Como você gostaria de construir sua carteira de investimentos?
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Carteira IA */}
          <Card 
            className={`cursor-pointer transition-all duration-200 bg-gray-900 border-gray-700 ${
              estrategia === 'ia' ? 'border-2 border-orange-500 shadow-lg' : 'hover:border-orange-500/50'
            }`}
            onClick={() => setEstrategia('ia')}
          >
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Sparkles className="w-8 h-8 text-orange-500" />
                <Badge className="bg-orange-500/10 text-orange-500">Recomendado</Badge>
              </div>
              <CardTitle className="text-white">Carteira IA</CardTitle>
              <p className="text-sm text-gray-400">
                Deixe nossa inteligência artificial montar e gerenciar sua carteira automaticamente
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-white">Diversificação Automática</p>
                    <p className="text-xs text-gray-400">
                      Distribui seu capital entre 5-10 empresas diferentes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-white">Otimização Contínua</p>
                    <p className="text-xs text-gray-400">
                      Realoca investimentos com base no desempenho
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-white">Sem Taxa de Gestão</p>
                    <p className="text-xs text-gray-400">
                      Apenas taxa de performance sobre ganhos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-white">Investimento Mínimo: R$ 1.000</p>
                    <p className="text-xs text-gray-400">
                      Ideal para começar a investir
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Picking */}
          <Card 
            className={`cursor-pointer transition-all duration-200 bg-gray-900 border-gray-700 ${
              estrategia === 'picking' ? 'border-2 border-orange-500 shadow-lg' : 'hover:border-orange-500/50'
            }`}
            onClick={() => setEstrategia('picking')}
          >
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Target className="w-8 h-8 text-orange-500" />
                <Badge variant="outline" className="border-gray-600 text-gray-300">Avançado</Badge>
              </div>
              <CardTitle className="text-white">Credit Picking</CardTitle>
              <p className="text-sm text-gray-400">
                Escolha manualmente em quais empresas SaaS investir
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-white">Controle Total</p>
                    <p className="text-xs text-gray-400">
                      Você decide em quais empresas investir
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-white">Análise Profunda</p>
                    <p className="text-xs text-gray-400">
                      Acesso a métricas detalhadas de cada empresa
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-white">Flexibilidade Total</p>
                    <p className="text-xs text-gray-400">
                      Monte sua estratégia personalizada
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-white">Investimento Mínimo: R$ 5.000</p>
                    <p className="text-xs text-gray-400">
                      Para investidores experientes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-600 disabled:text-gray-400"
            disabled={!estrategia}
            onClick={handleFinalizar}
          >
            {estrategia === 'ia' ? 'Criar Carteira IA →' : estrategia === 'picking' ? 'Ir para Marketplace →' : 'Selecione uma estratégia'}
          </Button>
          
          {estrategia && (
            <p className="text-xs text-gray-400 mt-2">
              Você poderá alterar sua estratégia a qualquer momento
            </p>
          )}
        </div>
      </div>
    </div>
  );
}