"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { onboardingStorage } from '@/lib/onboardingStorage';

interface Step5Data {
  patrimonio_liquido: 'ate_300k' | '300k_1mi' | '1mi_5mi' | 'acima_5mi';
  experiencia_ativos_risco: string[];
  modelo_investimento: 'conservador' | 'moderado' | 'agressivo';
  declaracao_risco: boolean;
}

const patrimonioOptions = [
  { value: 'ate_300k', label: 'Até R$ 300 mil' },
  { value: '300k_1mi', label: 'De R$ 300 mil a R$ 1 milhão' },
  { value: '1mi_5mi', label: 'De R$ 1 milhão a R$ 5 milhões' },
  { value: 'acima_5mi', label: 'Acima de R$ 5 milhões' }
];

const experienciaOptions = [
  { id: 'acoes', label: 'Ações' },
  { id: 'fundos', label: 'Fundos de Investimento' },
  { id: 'cripto', label: 'Criptomoedas' },
  { id: 'fiis', label: 'Fundos Imobiliários (FIIs)' },
  { id: 'renda_fixa', label: 'Renda Fixa (CDB, LCI, LCA)' },
  { id: 'tesouro', label: 'Tesouro Direto' }
];

export default function CadastroPerfilInvestidor() {
  const router = useRouter();
  const [patrimonio, setPatrimonio] = useState<string>('');
  const [experiencia, setExperiencia] = useState<string[]>([]);
  const [modelo, setModelo] = useState<string>('');
  const [declaracao, setDeclaracao] = useState(false);

  // Proteção de rota e carregamento
  useEffect(() => {
    if (!onboardingStorage.validateStepAccess(5)) {
      router.push('/cadastro/nome');
      return;
    }

    // Carregar dados salvos
    const saved = onboardingStorage.getStep(5);
    if (saved) {
      setPatrimonio(saved.patrimonio_liquido);
      setExperiencia(saved.experiencia_ativos_risco);
      setModelo(saved.modelo_investimento);
      setDeclaracao(saved.declaracao_risco);
    }
  }, [router]);

  const toggleExperiencia = (id: string, checked: boolean | string) => {
    if (checked) {
      setExperiencia(prev => [...prev, id]);
    } else {
      setExperiencia(prev => prev.filter(item => item !== id));
    }
  };

  const isValid = patrimonio && modelo && declaracao;

  const handleContinuar = () => {
    if (!isValid) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const data: Step5Data = {
      patrimonio_liquido: patrimonio as Step5Data['patrimonio_liquido'],
      experiencia_ativos_risco: experiencia,
      modelo_investimento: modelo as Step5Data['modelo_investimento'],
      declaracao_risco: declaracao
    };

    onboardingStorage.saveStep(5, data);
    toast.success('Perfil de investidor salvo!');
    
    router.push('/cadastro/termos_consentimento');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <OnboardingProgress currentStep={5} totalSteps={7} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground text-white mb-3">Perfil de Investidor 📊</h1>
          <p className="text-xl text-muted-foreground">
            Vamos conhecer melhor seu perfil para recomendar os melhores investimentos
          </p>
        </div>

        {/* Content box */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-8">
            {/* Patrimônio Líquido */}
            <div>
              <Label className="text-base font-semibold text-card-foreground">Qual seu patrimônio líquido aproximado? *</Label>
              <RadioGroup value={patrimonio} onValueChange={setPatrimonio} className="mt-3">
                {patrimonioOptions.map((option) => (
                  <Label 
                    key={option.value}
                    className="flex items-center gap-3 p-4 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800 text-white"
                  >
                    <RadioGroupItem value={option.value} />
                    <span>{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Experiência em Investimentos */}
            <div>
              <Label className="text-base font-semibold text-white">Você já investiu em: (marque todos que se aplicam)</Label>
              <div className="mt-3 space-y-3">
                {experienciaOptions.map((option) => (
                  <Label key={option.id} className="flex items-center gap-3 cursor-pointer text-white">
                    <Checkbox 
                      checked={experiencia.includes(option.id)}
                      onCheckedChange={(checked) => toggleExperiencia(option.id, checked)}
                    />
                    <span>{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>

            {/* Perfil de Risco */}
            <div>
              <Label className="text-base font-semibold text-white">Qual seu perfil de investimento? *</Label>
              <div className="flex flex-col lg:flex-row gap-6 mt-6">
                <button
                  type="button"
                  onClick={() => setModelo('conservador')}
                  className={`flex-1 p-8 border-2 rounded-lg transition-all ${
                    modelo === 'conservador' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-600 hover:border-orange-500/50'
                  }`}
                >
                  <div className="text-4xl mb-2">🛡️</div>
                  <p className="font-semibold text-white">Conservador</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Prefiro segurança, mesmo com retornos menores
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setModelo('moderado')}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    modelo === 'moderado' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-600 hover:border-orange-500/50'
                  }`}
                >
                  <div className="text-4xl mb-2">⚖️</div>
                  <p className="font-semibold text-white">Moderado</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Equilibrio entre risco e retorno
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setModelo('agressivo')}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    modelo === 'agressivo' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-600 hover:border-orange-500/50'
                  }`}
                >
                  <div className="text-4xl mb-2">🚀</div>
                  <p className="font-semibold text-white">Agressivo</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Busco maiores retornos, aceito mais riscos
                  </p>
                </button>
              </div>
            </div>

            {/* Declaração de Risco */}
            <div className="p-4 border-2 border-orange-500 bg-orange-500/10 rounded-lg">
              <Label className="flex items-start gap-3 cursor-pointer">
                <Checkbox 
                  checked={declaracao}
                  onCheckedChange={(checked) => setDeclaracao(checked as boolean)}
                  className="mt-1"
                />
                <span className="text-sm text-white">
                  Declaro estar ciente dos riscos de investimento em ativos de renda variável e 
                  que os retornos passados não garantem rentabilidade futura. *
                </span>
              </Label>
            </div>

            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-600 disabled:text-gray-400"
              disabled={!isValid}
              onClick={handleContinuar}
            >
              {isValid ? 'Continuar →' : 'Preencha todos os campos obrigatórios'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}