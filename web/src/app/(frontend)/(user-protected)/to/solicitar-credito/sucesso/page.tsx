"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SucessoPage() {
  const router = useRouter();
  const [contractId, setContractId] = useState('');

  useEffect(() => {
    // Get submission result
    const result = localStorage.getItem('submissionResult');
    if (!result) {
      router.push('/to/solicitar-credito/step-1');
      return;
    }

    const data = JSON.parse(result);
    setContractId(data.contrato_id);

    // Clean up stored result after displaying
    localStorage.removeItem('submissionResult');
  }, [router]);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleGoToMinhasDividas = () => {
    router.push('/to/minhas_dividas');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        
        <div className="mb-6 text-6xl">🎉</div>
        
        <h1 className="text-3xl font-bold mb-4">
          Proposta Criada com Sucesso!
        </h1>
        
        <p className="text-muted-foreground mb-8 max-w-md">
          Sua solicitação de crédito foi enviada e está sendo analisada. 
          Você receberá uma notificação assim que ela for publicada no marketplace.
        </p>
        
        {contractId && (
          <Card className="max-w-md w-full mb-8">
            <CardContent className="pt-6">
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID da Proposta</span>
                  <span className="font-mono font-semibold">#{contractId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                    Em Análise
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo Estimado</span>
                  <span className="font-semibold">24-48h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Next Steps */}
        <Card className="max-w-lg w-full mb-8 bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              📋 Próximos Passos
            </h3>
            <div className="text-left space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Nossa equipe analisará sua proposta em até 48 horas</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Após aprovação, sua proposta será publicada no marketplace</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Investidores interessados farão ofertas com suas condições</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>Você receberá notificações sobre cada nova oferta recebida</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">5.</span>
                <span>Poderá comparar e aceitar a melhor proposta para seu negócio</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="max-w-lg w-full mb-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              💬 Precisa de Ajuda?
            </h3>
            <div className="text-left space-y-2 text-sm">
              <p className="text-muted-foreground">
                Nossa equipe está pronta para te ajudar durante todo o processo:
              </p>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:suporte@will.lending" className="text-primary hover:underline">
                  suporte@will.lending
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>💬</span>
                <span className="text-muted-foreground">Chat disponível 24/7 no dashboard</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={handleGoToDashboard}
          >
            Ir para Dashboard
          </Button>
          <Button 
            onClick={handleGoToMinhasDividas}
          >
            Ver Minhas Dívidas
          </Button>
        </div>
        
      </div>
    </DashboardLayout>
  );
}