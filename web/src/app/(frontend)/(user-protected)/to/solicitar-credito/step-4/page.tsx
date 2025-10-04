"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { ConfirmationSummary } from '@/components/wizard/ConfirmationSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function Step4Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [wizardData, setWizardData] = useState<any>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if user came from previous steps
    const savedData = localStorage.getItem('wizardData');
    if (!savedData) {
      router.push('/to/solicitar-credito/step-1');
      return;
    }

    const data = JSON.parse(savedData);
    if (!data.simulation) {
      router.push('/to/solicitar-credito/step-3');
      return;
    }

    setWizardData(data);
  }, [router]);

  const handleSubmit = async () => {
    if (!acceptTerms || !acceptPrivacy) {
      toast.error('Você deve aceitar os termos e política de privacidade');
      return;
    }

    setSubmitting(true);

    try {
      // Mock API call to submit the credit request
      // const response = await fetch('/api/propostas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     valor_solicitado: wizardData.valorSolicitado,
      //     proposito: wizardData.proposito,
      //     detalhamento: wizardData.detalhamento,
      //     apis_conectadas: wizardData.connections,
      //     simulacao: wizardData.simulation
      //   })
      // });
      // const result = await response.json();

      // Mock successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        success: true,
        contrato_id: 'PROP-2024-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        status: 'em_analise'
      };

      // Save result and clear wizard data
      localStorage.setItem('submissionResult', JSON.stringify(mockResult));
      localStorage.removeItem('wizardData');

      // Navigate to success page
      router.push('/to/solicitar-credito/sucesso');

    } catch (error) {
      toast.error('Erro ao enviar proposta. Tente novamente.');
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/to/solicitar-credito/step-3');
  };

  if (!wizardData) {
    return (
      <WizardLayout currentStep={4} totalSteps={4}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Carregando...</span>
        </div>
      </WizardLayout>
    );
  }

  return (
    <WizardLayout currentStep={4} totalSteps={4}>
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Confirmação Final</h1>
        <p className="text-muted-foreground">
          Revise todos os dados antes de enviar sua proposta
        </p>
      </div>

      {/* Confirmation Summary */}
      <ConfirmationSummary 
        wizardData={wizardData}
        simulation={wizardData.simulation}
      />

      {/* Terms and Conditions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Termos e Condições</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                Aceito os{' '}
                <a href="/termos" target="_blank" className="text-primary hover:underline">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="/contrato" target="_blank" className="text-primary hover:underline">
                  Contrato de Empréstimo
                </a>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Li e concordo com todas as cláusulas do contrato de empréstimo
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={acceptPrivacy}
              onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                Aceito a{' '}
                <a href="/privacidade" target="_blank" className="text-primary hover:underline">
                  Política de Privacidade
                </a>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Autorizo o uso dos meus dados conforme descrito na política de privacidade
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Instructions */}
      <Alert className="mt-6 bg-blue-500/5 border-blue-500/20">
        <AlertDescription>
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="font-semibold mb-2">O que acontece após o envio?</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Sua proposta será analisada em até 48 horas</li>
                <li>Após aprovação, será publicada no marketplace</li>
                <li>Investidores farão ofertas com suas condições</li>
                <li>Você receberá notificações sobre novas ofertas</li>
                <li>Poderá aceitar a melhor proposta recebida</li>
              </ol>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack} disabled={submitting}>
          ← Voltar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!acceptTerms || !acceptPrivacy || submitting}
          className="bg-success hover:bg-success/90"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando proposta...
            </>
          ) : (
            'Enviar Proposta 🚀'
          )}
        </Button>
      </div>
      
    </WizardLayout>
  );
}