"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { FacialVerification } from '@/components/onboarding/FacialVerification';
import { onboardingStorage } from '@/lib/onboardingStorage';
import { toast } from 'sonner';

export default function CadastroProvaDeVida() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Proteção de rota
  useEffect(() => {
    if (!onboardingStorage.validateStepAccess(4)) {
      router.push('/cadastro/nome');
      return;
    }
    
    setLoading(false);
  }, [router]);

  const handleSuccess = (data: { image: string; confidence: number }) => {
    onboardingStorage.saveStep(4, data);
    toast.success('Verificação facial concluída!');
    router.push('/cadastro/perfil_investidor');
  };

  const handleError = (error: string) => {
    toast.error('Erro na verificação facial. Tente novamente.');
    console.error('Facial verification error:', error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <OnboardingProgress currentStep={4} totalSteps={7} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground text-white mb-3">Prova de Vida 📸</h1>
          <p className="text-xl text-muted-foreground">
            Vamos tirar uma selfie rápida para validar sua identidade
          </p>
        </div>

        <FacialVerification 
          mockMode={true} 
          onSuccess={handleSuccess} 
          onError={handleError} 
        />
      </div>
    </div>
  );
}