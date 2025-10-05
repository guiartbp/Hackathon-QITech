"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Check, Eye, RefreshCw, CreditCard, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { tomadorOnboardingStorage } from '@/lib/tomadorOnboardingStorage';

interface Step3Data {
  stripe_connected: boolean;
  stripe_account_id?: string;
  access_token?: string;
  skipped?: boolean;
  connected_at?: string;
}

export default function IntegracaoStripe() {
  const router = useRouter();
  const [conectando, setConectando] = useState(false);

  // Proteção de rota
  useEffect(() => {
    if (!tomadorOnboardingStorage.validateStepAccess(3)) {
      router.push('/to/dados-pessoais');
      return;
    }

    // Verificar se já conectado
    const saved = tomadorOnboardingStorage.getStep(3) as Step3Data;
    if (saved?.stripe_connected) {
      toast.success('Stripe já conectado!');
      router.push('/to/kyc');
    }
  }, [router]);

  const handleStripeConnect = async () => {
    setConectando(true);
    
    try {
      // Simular início do OAuth
      toast.info('Redirecionando para Stripe...');
      
      // Para hackathon: simular delay de OAuth
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock de dados da conexão bem-sucedida
      const mockData: Step3Data = {
        stripe_connected: true,
        stripe_account_id: 'acct_mock_' + Date.now(),
        access_token: 'sk_test_mock_token_' + Math.random().toString(36).substring(7),
        connected_at: new Date().toISOString()
      };
      
      // Salvar dados mockados
      tomadorOnboardingStorage.saveStep(3, mockData);
      
      toast.success('Stripe conectado com sucesso! ✓');
      
      // Navegar para próxima tela
      router.push('/to/kyc');
      
    } catch (error) {
      toast.error('Erro ao conectar com Stripe. Tente novamente.');
    } finally {
      setConectando(false);
    }
  };

  const handlePular = () => {
    const data: Step3Data = { 
      stripe_connected: false,
      skipped: true 
    };
    
    tomadorOnboardingStorage.saveStep(3, data);
    toast.warning('Você precisará conectar o Stripe depois para solicitar crédito');
    router.push('/to/kyc');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <OnboardingProgress currentStep={3} totalSteps={5} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Conecte sua plataforma de cobrança 🔗</h1>
          <p className="text-xl text-gray-400">
            Precisamos do Stripe para analisar seu MRR e aprovar crédito
          </p>
        </div>

        {/* Content box */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-8">
            
            {/* Card Principal do Stripe */}
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Stripe Billing</h3>
                  <p className="text-purple-300">Plataforma de cobrança conectada</p>
                </div>
              </div>

              {/* Ícones de Segurança */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">OAuth seguro</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Acesso read-only</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Dados criptografados</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Revogável</span>
                </div>
              </div>

              {/* Métricas Coletadas */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-3">Métricas coletadas:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-orange-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">MRR</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">NRR</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Churn Rate</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">LTV</span>
                  </div>
                </div>
              </div>

              {/* Botão de Conexão */}
              <Button
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-700"
                disabled={conectando}
                onClick={handleStripeConnect}
              >
                {conectando ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  'Conectar com Stripe →'
                )}
              </Button>
            </div>

            {/* Alerta Importante */}
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-500 mb-2">⚠️ Sem esta conexão, não conseguimos:</h4>
                  <ul className="text-sm text-yellow-200 space-y-1">
                    <li>• Calcular seu score de crédito</li>
                    <li>• Validar suas métricas de SaaS</li>
                    <li>• Aprovar sua solicitação de crédito</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Por que precisamos do Stripe?</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Validamos sua receita recorrente (MRR) em tempo real</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Analisamos métricas de saúde do seu SaaS (Churn, LTV, NRR)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Oferecemos crédito baseado em dados reais, não projeções</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Processo de aprovação automatizado e mais rápido</span>
                </div>
              </div>
            </div>

            {/* Como funciona */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-3">🔄 Como funciona a conexão:</h4>
              <div className="space-y-3 text-sm text-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">1</div>
                  <span>Você será redirecionado para o Stripe</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">2</div>
                  <span>Fará login na sua conta Stripe</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">3</div>
                  <span>Autorizará acesso read-only às métricas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">4</div>
                  <span>Voltará automaticamente para nossa plataforma</span>
                </div>
              </div>
            </div>

            {/* Botão Pular */}
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePular}
                className="text-gray-400 hover:text-gray-300 hover:bg-gray-800"
              >
                Pular por agora
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Você pode conectar depois no seu dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}