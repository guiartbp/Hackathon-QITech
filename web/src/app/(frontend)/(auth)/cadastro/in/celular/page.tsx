"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { onboardingStorage } from '@/lib/onboardingStorage';
import { validarEmail, validarTelefone } from '@/lib/validators';
import { mascaraTelefone } from '@/lib/masks';

interface Step2Data {
  telefone: string;
  email: string;
}

export default function CadastroCelular() {
  const router = useRouter();
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Proteção de rota
  useEffect(() => {
    if (!onboardingStorage.validateStepAccess(2)) {
      router.push('/cadastro/in/nome');
      return;
    }

    // Carregar dados salvos
    const saved = onboardingStorage.getStep(2);
    if (saved) {
      setTelefone(saved.telefone);
      setEmail(saved.email);
    }
  }, [router]);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = mascaraTelefone(e.target.value);
    setTelefone(masked);
  };

  const telefoneValido = validarTelefone(telefone);
  const emailValido = validarEmail(email);
  const isValid = telefoneValido && emailValido;

  const handleContinuar = () => {
    if (!isValid) {
      toast.error('Verifique os dados inseridos');
      return;
    }

    // Salvar dados
    const data: Step2Data = {
      telefone: telefone,
      email: email.trim()
    };
    onboardingStorage.saveStep(2, data);

    toast.success('Contatos salvos com sucesso!');
    
    // Navegar
    router.push('/cadastro/in/documento');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <OnboardingProgress currentStep={2} totalSteps={7} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground text-white mb-3">Seus contatos 📱</h1>
          <p className="text-xl text-muted-foreground">
            Precisamos do seu telefone e email para comunicação
          </p>
        </div>

        {/* Content box */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-8">
            {/* Input Telefone */}
            <div className="space-y-2">
                            <Label htmlFor="telefone" className="text-base font-semibold text-card-foreground">Telefone *</Label>
              <div className="relative">
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  className="pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {telefone && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {telefoneValido ? (
                      <Check className="w-4 h-4 text-orange-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {telefone && !telefoneValido && (
                <p className="text-xs text-red-400">
                  Digite um celular válido com 11 dígitos
                </p>
              )}
            </div>

            {/* Input Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email *</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailValido ? (
                      <Check className="w-4 h-4 text-orange-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {email && !emailValido && (
                <p className="text-xs text-red-400">
                  Digite um email válido
                </p>
              )}
            </div>

            {/* Informação sobre uso dos dados */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
              <p className="text-sm text-orange-500">
                🔒 Seus dados estão seguros e serão usados apenas para comunicação sobre seus investimentos
              </p>
            </div>

            {/* Botão Continuar */}
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-700 disabled:text-gray-400"
              disabled={!isValid}
              onClick={handleContinuar}
            >
              {isValid ? 'Continuar →' : 'Preencha todos os campos corretamente'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}