"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { FacialVerification } from '@/components/onboarding/FacialVerification'; 
import { tomadorOnboardingStorage } from '@/lib/tomadorOnboardingStorage';

interface Step4Data {
  facial_verification: boolean;
  image: string;
  confidence: number;
  verified_at: string;
}

export default function KYC() {
  const router = useRouter();

  // Proteção de rota
  useEffect(() => {
    if (!tomadorOnboardingStorage.validateStepAccess(4)) {
      router.push('/cadastro/to/dados-pessoais');
      return;
    }

    // Verificar se já verificado
    const saved = tomadorOnboardingStorage.getStep(4) as Step4Data;
    if (saved?.facial_verification) {
      toast.success('KYC já realizado!');
      router.push('/cadastro/to/sucesso');
    }
  }, [router]);

  const handleSuccess = (data: { image: string; confidence: number }) => {
    const stepData: Step4Data = {
      facial_verification: true,
      image: data.image,
      confidence: data.confidence,
      verified_at: new Date().toISOString()
    };
    
    tomadorOnboardingStorage.saveStep(4, stepData);
    toast.success('Identidade verificada com sucesso! ✓');

    // Navegar para tela de sucesso
    router.push('/cadastro/to/sucesso');
  };

  const handleError = (error: string) => {
    toast.error('Erro na verificação. Tente novamente.');
    console.error('KYC Error:', error);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <OnboardingProgress currentStep={4} totalSteps={5} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Validação de Identidade 📸</h1>
          <p className="text-xl text-gray-400">
            Última etapa: vamos verificar sua identidade
          </p>
        </div>

        {/* Content box */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-8">
            
            {/* Informações sobre o KYC */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Verificação Facial</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Tire uma selfie para confirmar sua identidade como representante legal da empresa
                </p>
              </div>
            </div>

            {/* Componente de Verificação Facial */}
            <div className="max-w-md mx-auto">
              <FacialVerification 
                mockMode={true}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>

            {/* Por que precisamos disso? */}
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Por que precisamos disso?
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Conformidade com regulação KYC</p>
                      <p className="text-sm text-gray-400">Cumprimos as normas do Banco Central</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Prevenir fraude</p>
                      <p className="text-sm text-gray-400">Protege sua empresa e nossos investidores</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Proteger investidores</p>
                      <p className="text-sm text-gray-400">Garantimos transparência no marketplace</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Confirmar representação legal</p>
                      <p className="text-sm text-gray-400">Verificamos que você pode assinar contratos pela empresa</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Segurança */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">🔒 Segurança dos seus dados</h4>
                  <ul className="text-sm text-blue-200 space-y-1">
                    <li>• Imagem processada localmente e criptografada</li>
                    <li>• Dados biométricos não são armazenados</li>
                    <li>• Processo auditado por empresas de segurança</li>
                    <li>• Conformidade com LGPD e padrões internacionais</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ajuda */}
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                Está com dificuldades?
              </p>
              <button 
                className="text-orange-500 hover:text-orange-400 text-sm underline"
                onClick={() => toast.info('Em caso de problemas, entre em contato com nosso suporte')}
              >
                Fale com nosso suporte
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}