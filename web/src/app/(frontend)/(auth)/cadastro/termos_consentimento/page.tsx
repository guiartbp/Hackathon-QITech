"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { onboardingStorage } from '@/lib/onboardingStorage';

interface Step6Data {
  termos_aceitos: boolean;
  consentimentos: {
    riscos_p2p: boolean;
    riscos_saas: boolean;
    variacao_retornos: boolean;
    ausencia_fgc: boolean;
    capacidade_financeira: boolean;
  };
}

export default function CadastroTermosConsentimento() {
  const router = useRouter();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [consentimentos, setConsentimentos] = useState({
    riscos_p2p: false,
    riscos_saas: false,
    variacao_retornos: false,
    ausencia_fgc: false,
    capacidade_financeira: false
  });

  // Proteção de rota
  useEffect(() => {
    if (!onboardingStorage.validateStepAccess(6)) {
      router.push('/cadastro/nome');
      return;
    }

    // Carregar dados salvos
    const saved = onboardingStorage.getStep(6);
    if (saved) {
      setConsentimentos(saved.consentimentos);
      setScrolledToBottom(true); // Se já foi salvo, assume que já leu
    }
  }, [router]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      setScrolledToBottom(true);
    }
  };

  const updateConsentimento = (key: string, value: boolean) => {
    setConsentimentos(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const allConsentsGiven = Object.values(consentimentos).every(v => v) && scrolledToBottom;

  const handleContinuar = () => {
    if (!allConsentsGiven) {
      toast.error('Você deve ler todos os termos e marcar todos os consentimentos');
      return;
    }

    const data: Step6Data = {
      termos_aceitos: true,
      consentimentos: consentimentos
    };

    onboardingStorage.saveStep(6, data);
    toast.success('Termos aceitos com sucesso!');
    
    router.push('/cadastro/onboarding');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <OnboardingProgress currentStep={6} totalSteps={7} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground text-white mb-3">
            ⚠️ Termos de Consentimento
          </h1>
          <p className="text-xl text-muted-foreground">
            É fundamental que você entenda os riscos antes de investir
          </p>
        </div>

        {/* Content box */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-6">
            {/* Área Scrollável com Termos */}
            <div 
              className="max-h-96 overflow-y-scroll border border-gray-600 rounded-lg p-6 bg-gray-800 space-y-6"
              onScroll={handleScroll}
            >
              <div className="text-sm">
                <div className="text-center mb-6">
                  <h2 className="font-bold text-lg text-red-400 mb-2">
                    IMPORTANTE: INVESTIMENTOS EM P2P ENVOLVEM RISCOS
                  </h2>
                  <p className="font-semibold text-base text-white">
                    Uma plataforma P2P envolve riscos de inadimplência. 
                    Os retornos NÃO são garantidos pelo FGC.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">1. Risco de Crédito (Inadimplência)</h4>
                    <p className="text-gray-300 mb-2">
                      As empresas SaaS podem não honrar os pagamentos mensais. Mesmo com score alto, 
                      existe risco de default. Em caso de inadimplência, você pode perder parte ou 
                      todo o capital investido.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">2. Ausência de Garantia do FGC</h4>
                    <p className="text-gray-300 mb-2">
                      Diferente de investimentos tradicionais como CDB e poupança, investimentos P2P 
                      NÃO possuem cobertura do Fundo Garantidor de Créditos (FGC). Não há proteção 
                      governamental em caso de perdas.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">3. Volatilidade do Setor SaaS</h4>
                    <p className="text-gray-300 mb-2">
                      Empresas de software podem enfrentar alta competição, mudanças tecnológicas 
                      rápidas, perda de clientes (churn) e variações no MRR. O mercado SaaS é dinâmico 
                      e pode ser afetado por crises econômicas.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">4. Variação dos Retornos</h4>
                    <p className="text-gray-300 mb-2">
                      Os retornos são baseados no desempenho real das empresas. Mesmo empresas 
                      saudáveis podem ter meses ruins. Retornos passados não garantem rentabilidade futura.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">5. Liquidez Limitada</h4>
                    <p className="text-gray-300 mb-2">
                      Não há mercado secundário ativo. Uma vez feito o investimento, você deve 
                      aguardar o prazo para reaver o capital. Saques antecipados podem não ser possíveis 
                      ou ter custos elevados.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">6. Concentração de Risco</h4>
                    <p className="text-gray-300 mb-2">
                      Apesar da diversificação, você está exposto especificamente ao setor de 
                      tecnologia/SaaS. Uma crise setorial pode afetar múltiplos investimentos simultaneamente.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 border-l-4 border-orange-500 bg-orange-500/10">
                  <h4 className="font-semibold mb-2 text-orange-500">💡 Como a will.lending mitiga os riscos:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    <li><strong>Score Híbrido:</strong> Análise profunda com métricas específicas de SaaS (MRR, NRR, Churn, LTV)</li>
                    <li><strong>Diversificação:</strong> Seu capital é automaticamente distribuído entre várias empresas</li>
                    <li><strong>Monitoramento:</strong> Acompanhamento contínuo das métricas financeiras das empresas</li>
                    <li><strong>Due Diligence:</strong> Análise rigorosa antes da aprovação de cada empresa</li>
                    <li><strong>Transparência:</strong> Relatórios mensais detalhados sobre performance</li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500 rounded">
                  <p className="text-sm font-medium text-orange-400">
                    ⚠️ IMPORTANTE: Invista apenas valores que você pode se dar ao luxo de perder. 
                    Recomendamos que investimentos em P2P não excedam 5-10% do seu patrimônio total.
                  </p>
                </div>
              </div>
            </div>

            {/* Indicador de Scroll */}
            {!scrolledToBottom && (
              <p className="text-xs text-orange-400 text-center">
                ⚠️ Role até o final para confirmar a leitura dos termos
              </p>
            )}

            {/* Checkboxes de Consentimento */}
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 text-white">Confirmações Obrigatórias:</h3>
                
                <div className="space-y-3">
                  <Label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox 
                      disabled={!scrolledToBottom}
                      checked={consentimentos.riscos_p2p}
                      onCheckedChange={(c) => updateConsentimento('riscos_p2p', c as boolean)}
                      className="mt-1"
                    />
                    <span className="text-sm text-white">
                      Li e compreendi os riscos específicos de investimentos P2P, incluindo risco de inadimplência *
                    </span>
                  </Label>
                  
                  <Label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox 
                      disabled={!scrolledToBottom}
                      checked={consentimentos.ausencia_fgc}
                      onCheckedChange={(c) => updateConsentimento('ausencia_fgc', c as boolean)}
                      className="mt-1"
                    />
                    <span className="text-sm text-white">
                      Estou ciente de que investimentos P2P NÃO possuem cobertura do FGC *
                    </span>
                  </Label>
                  
                  <Label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox 
                      disabled={!scrolledToBottom}
                      checked={consentimentos.riscos_saas}
                      onCheckedChange={(c) => updateConsentimento('riscos_saas', c as boolean)}
                      className="mt-1"
                    />
                    <span className="text-sm text-white">
                      Compreendo os riscos específicos do setor SaaS (volatilidade, competição, churn) *
                    </span>
                  </Label>
                  
                  <Label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox 
                      disabled={!scrolledToBottom}
                      checked={consentimentos.variacao_retornos}
                      onCheckedChange={(c) => updateConsentimento('variacao_retornos', c as boolean)}
                      className="mt-1"
                    />
                    <span className="text-sm text-white">
                      Aceito que os retornos podem variar e que rentabilidade passada não garante rentabilidade futura *
                    </span>
                  </Label>
                  
                  <Label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox 
                      disabled={!scrolledToBottom}
                      checked={consentimentos.capacidade_financeira}
                      onCheckedChange={(c) => updateConsentimento('capacidade_financeira', c as boolean)}
                      className="mt-1"
                    />
                    <span className="text-sm text-white">
                      Declaro ter capacidade financeira para suportar eventuais perdas deste investimento *
                    </span>
                  </Label>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-600 disabled:text-gray-400"
              size="lg"
              disabled={!allConsentsGiven}
              onClick={handleContinuar}
            >
              {allConsentsGiven ? "Aceitar Termos e Continuar →" : "Leia todos os termos e marque todas as confirmações"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}