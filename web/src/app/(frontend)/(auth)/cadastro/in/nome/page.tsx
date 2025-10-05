"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { onboardingStorage } from '@/lib/onboardingStorage';

interface Step1Data {
  tipo_pessoa: 'PF' | 'PJ';
  nome_razao_social: string;
}

export default function CadastroNome() {
  const router = useRouter();
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ' | null>(null);
  const [nome, setNome] = useState('');

  // Carregar dados salvos (se existirem)
  useEffect(() => {
    const saved = onboardingStorage.getStep(1);
    if (saved) {
      setTipoPessoa(saved.tipo_pessoa);
      setNome(saved.nome_razao_social);
    }
  }, []);

  const isValid = tipoPessoa && nome.length >= 3;

  const handleContinuar = () => {
    if (!isValid) {
      toast.error('Preencha todos os campos');
      return;
    }

    // Salvar dados
    const data: Step1Data = {
      tipo_pessoa: tipoPessoa!,
      nome_razao_social: nome.trim()
    };
    onboardingStorage.saveStep(1, data);

    toast.success('Dados salvos com sucesso!');
    
    // Navegar
    router.push('/cadastro/in/celular');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <OnboardingProgress currentStep={1} totalSteps={7} showBack={false} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground text-white mb-3">Vamos começar! 👋</h1>
          <p className="text-xl text-muted-foreground">
            Você está investindo como pessoa física ou jurídica?
          </p>
        </div>

        {/* Content box */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-8">
            {/* Seleção de Tipo */}
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                type="button"
                onClick={() => setTipoPessoa('PF')}
                className={`
                  flex-1 p-8 rounded-lg border-2 transition-all duration-200 text-white
                  ${tipoPessoa === 'PF' 
                    ? 'border-orange-500 bg-orange-500/20' 
                    : 'border-gray-600 hover:border-orange-500/50'}
                `}
              >
                <User className="w-12 h-12 mx-auto mb-3" />
                <p className="font-semibold text-lg">Pessoa Física</p>
              </button>

              <button
                type="button"
                onClick={() => setTipoPessoa('PJ')}
                className={`
                  flex-1 p-8 rounded-lg border-2 transition-all duration-200 text-white
                  ${tipoPessoa === 'PJ' 
                    ? 'border-orange-500 bg-orange-500/20' 
                    : 'border-gray-600 hover:border-orange-500/50'}
                `}
              >
                <Building2 className="w-12 h-12 mx-auto mb-3" />
                <p className="font-semibold text-lg">Pessoa Jurídica</p>
              </button>
            </div>

            {/* Input de Nome (aparece após seleção) */}
            {tipoPessoa && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Label htmlFor="nome" className="text-card-foreground">
                  {tipoPessoa === 'PF' ? 'Nome Completo' : 'Razão Social'} *
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder={tipoPessoa === 'PF' ? 'João Silva' : 'Empresa LTDA'}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="text-lg bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {nome.length > 0 && nome.length < 3 && (
                  <p className="text-xs text-red-400">
                    Mínimo de 3 caracteres
                  </p>
                )}
              </div>
            )}

            {/* Botão Continuar */}
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-700 disabled:text-gray-400"
              disabled={!isValid}
              onClick={handleContinuar}
            >
              {isValid ? 'Continuar →' : 'Preencha todos os campos'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}