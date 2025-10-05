"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Mail, AlertTriangle, ExternalLink, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { tomadorOnboardingStorage } from '@/lib/tomadorOnboardingStorage';

interface OnboardingData {
  step1?: {
    nome_completo: string;
    email: string;
    cargo: string;
  };
  step2?: {
    nome_fantasia: string;
    segmento: string;
  };
  step3?: {
    stripe_connected: boolean;
  };
}

export default function Sucesso() {
  const router = useRouter();
  const [dadosOnboarding, setDadosOnboarding] = useState<OnboardingData>({});
  const [stripeConnected, setStripeConnected] = useState(false);

  useEffect(() => {
    // Verificar se chegou aqui corretamente
    if (!tomadorOnboardingStorage.validateStepAccess(5)) {
      router.push('/to/dados-pessoais');
      return;
    }

    // Verificar se completou o KYC
    const kycData = tomadorOnboardingStorage.getStep(4);
    if (!kycData) {
      router.push('/to/kyc');
      return;
    }

    // Carregar dados do onboarding
    const allData = tomadorOnboardingStorage.getAllSteps();
    setDadosOnboarding(allData);
    setStripeConnected(allData.step3?.stripe_connected || false);

    // Simular envio dos dados para API (em produção)
    const enviarDadosParaAPI = async () => {
      try {
        // Mock: Em produção, enviaria todos os dados para backend
        console.log('Enviando dados para API:', allData);
        toast.success('Dados enviados com sucesso para análise!');
      } catch (error) {
        console.error('Erro ao enviar dados:', error);
      }
    };

    enviarDadosParaAPI();

    // Limpar dados do localStorage após sucesso (opcional)
    // tomadorOnboardingStorage.clearAll();
  }, [router]);

  const handleVoltarStripe = () => {
    router.push('/to/integracao-stripe');
  };

  const handleIrDashboard = () => {
    // Em produção, redirecionaria para dashboard autenticado
    toast.info('Redirecionando para dashboard...');
    router.push('/dashboard');
  };

  const nomeUsuario = dadosOnboarding.step1?.nome_completo?.split(' ')[0] || 'Usuário';
  const emailUsuario = dadosOnboarding.step1?.email || '';
  const nomeEmpresa = dadosOnboarding.step2?.nome_fantasia || 'sua empresa';
  const segmento = dadosOnboarding.step2?.segmento || '';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        
        {/* Conteúdo Principal */}
        <div className="text-center space-y-8">
          
          {/* Ícone de Sucesso */}
          <div className="mx-auto w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>

          {/* Mensagem Principal */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Bem-vindo à Will Lending! 🚀
            </h1>
            <p className="text-xl text-gray-400 mb-2">
              Olá, {nomeUsuario}! Seu cadastro foi enviado com sucesso
            </p>
            <p className="text-lg text-gray-500">
              {nomeEmpresa} • {segmento}
            </p>
          </div>

          {/* Card de Status do Processo */}
          <Card className="bg-card border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                
                {/* Step 1 - Análise de Dados */}
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    stripeConnected ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}>
                    1
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-white">Análise de Dados</p>
                    <p className="text-sm text-gray-400">
                      {stripeConnected 
                        ? '✓ Métricas do Stripe coletadas e sendo analisadas' 
                        : '⚠️ Conecte o Stripe para liberar análise'
                      }
                    </p>
                  </div>
                </div>

                {/* Step 2 - Cálculo de Score */}
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    stripeConnected ? 'bg-orange-500' : 'bg-gray-600'
                  }`}>
                    2
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-white">Cálculo de Score</p>
                    <p className="text-sm text-gray-400">
                      {stripeConnected 
                        ? 'Em processamento (2-24h)' 
                        : 'Aguardando conexão com Stripe'
                      }
                    </p>
                  </div>
                </div>

                {/* Step 3 - Aprovação Final */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-white">Aprovação Final</p>
                    <p className="text-sm text-gray-400">
                      Você receberá email quando aprovado
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Passos */}
          <div className="bg-orange-500/10 border border-orange-500 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-orange-500 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-orange-500 mb-3">📧 Próximos Passos</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Enviaremos um email para <strong>{emailUsuario}</strong> quando sua análise for concluída</li>
                  <li>• Você poderá acessar seu dashboard e acompanhar seu score de crédito</li>
                  <li>• Após aprovação, poderá solicitar sua primeira proposta de crédito</li>
                  <li>• Processo de aprovação automático com base em dados do Stripe</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alerta se Stripe não conectado */}
          {!stripeConnected && (
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                <div className="text-left">
                  <h3 className="font-semibold text-yellow-500 mb-3">⚠️ Ação Necessária</h3>
                  <p className="text-sm text-yellow-200 mb-4">
                    Para prosseguir com a análise de crédito, você precisa conectar sua conta do Stripe. 
                    Sem essa conexão, não conseguimos validar suas métricas de receita.
                  </p>
                  <Button
                    onClick={handleVoltarStripe}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Conectar Stripe Agora
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline do que acontece depois */}
          <Card className="bg-gray-800 border-gray-600 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                O que acontece agora?
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                    24h
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">Análise automatizada</p>
                    <p className="text-gray-400">Nossos algoritmos analisam suas métricas de SaaS</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                    48h
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">Score de crédito</p>
                    <p className="text-gray-400">Você recebe seu score e limite pré-aprovado</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                    72h
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">Primeira proposta</p>
                    <p className="text-gray-400">Pode solicitar seu primeiro financiamento</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="space-y-3">
            {!stripeConnected ? (
              <Button 
                className="w-full max-w-md bg-orange-500 hover:bg-orange-600"
                onClick={handleVoltarStripe}
              >
                Conectar Stripe Agora
              </Button>
            ) : (
              <Button 
                className="w-full max-w-md bg-green-500 hover:bg-green-600"
                disabled
              >
                ✓ Tudo pronto! Aguarde nosso email
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="w-full max-w-md border-gray-600 text-white hover:bg-gray-800"
              onClick={handleIrDashboard}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ir para Dashboard
            </Button>
          </div>

          {/* Informação de contato */}
          <div className="text-center pt-8">
            <p className="text-sm text-gray-400 mb-2">
              Dúvidas sobre o processo?
            </p>
            <button 
              className="text-orange-500 hover:text-orange-400 text-sm underline"
              onClick={() => toast.info('Email: suporte@willlending.com | WhatsApp: (11) 99999-9999')}
            >
              Entre em contato conosco
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}