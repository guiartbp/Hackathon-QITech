"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { APIConnectionCard } from '@/components/wizard/APIConnectionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface APIConnection {
  name: string;
  status: 'connected' | 'disconnected' | 'connecting';
  lastSync?: string;
  description: string;
  logo: string;
  connectUrl?: string;
}

export default function Step2Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<APIConnection[]>([]);
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationComplete, setValidationComplete] = useState(false);

  useEffect(() => {
    // Check if user came from step 1
    const savedData = localStorage.getItem('wizardData');
    if (!savedData) {
      router.push('/to/solicitar-credito/step-1');
      return;
    }

    // Initialize API connections
    setConnections([
      {
        name: 'Stripe',
        status: 'disconnected',
        description: 'Dados de receita e clientes',
        logo: '💳',
        connectUrl: '/api/integrations/stripe/connect'
      },
      {
        name: 'PayPal',
        status: 'disconnected',
        description: 'Transações e histórico financeiro',
        logo: '🅿️',
        connectUrl: '/api/integrations/paypal/connect'
      },
      {
        name: 'Banco Inter',
        status: 'disconnected',
        description: 'Extratos e movimentação bancária',
        logo: '🏦',
        connectUrl: '/api/integrations/inter/connect'
      },
      {
        name: 'PagSeguro',
        status: 'disconnected',
        description: 'Vendas e recebimentos online',
        logo: '📱',
        connectUrl: '/api/integrations/pagseguro/connect'
      }
    ]);

    setLoading(false);
  }, [router]);

  const handleConnect = async (connectionName: string) => {
    setConnections(prev => prev.map(conn => 
      conn.name === connectionName 
        ? { ...conn, status: 'connecting' }
        : conn
    ));

    try {
      // Mock OAuth flow - replace with actual integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      setConnections(prev => prev.map(conn => 
        conn.name === connectionName 
          ? { ...conn, status: 'connected', lastSync: new Date().toLocaleString('pt-BR') }
          : conn
      ));

      toast.success(`${connectionName} conectado com sucesso!`);
      
      // Start validation progress
      startValidation();
      
    } catch {
      setConnections(prev => prev.map(conn => 
        conn.name === connectionName 
          ? { ...conn, status: 'disconnected' }
          : conn
      ));
      toast.error(`Erro ao conectar ${connectionName}`);
    }
  };

  const startValidation = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setValidationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setValidationComplete(true);
        toast.success('Validação concluída com sucesso!');
      }
    }, 300);
  };

  const handleNext = () => {
    const connectedCount = connections.filter(c => c.status === 'connected').length;
    
    if (connectedCount === 0) {
      toast.error('Conecte pelo menos uma API para continuar');
      return;
    }

    if (!validationComplete) {
      toast.error('Aguarde a validação ser concluída');
      return;
    }

    // Save connection status
    const wizardData = JSON.parse(localStorage.getItem('wizardData') || '{}');
    wizardData.connections = connections.filter(c => c.status === 'connected').map(c => c.name);
    localStorage.setItem('wizardData', JSON.stringify(wizardData));

    router.push('/to/solicitar-credito/step-3');
  };

  const handleBack = () => {
    router.push('/to/solicitar-credito/step-1');
  };

  if (loading) {
    return (
      <WizardLayout currentStep={2} totalSteps={4}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Carregando...</span>
        </div>
      </WizardLayout>
    );
  }

  const connectedCount = connections.filter(c => c.status === 'connected').length;

  return (
    <WizardLayout currentStep={2} totalSteps={4}>
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Conecte suas APIs</h1>
        <p className="text-muted-foreground">
          Conecte suas ferramentas para validarmos os dados do seu negócio
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold">Progresso de Conexões</p>
              <p className="text-sm text-muted-foreground">
                {connectedCount} de {connections.length} APIs conectadas
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {Math.round((connectedCount / connections.length) * 100)}%
              </p>
            </div>
          </div>
          <Progress value={(connectedCount / connections.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Connection Cards */}
      <div className="space-y-4 mb-6">
        {connections.map((connection, index) => (
          <APIConnectionCard
            key={index}
            connection={connection}
            onConnect={handleConnect}
          />
        ))}
      </div>

      {/* Validation Status */}
      {connectedCount > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationComplete ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
              Validação de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validationComplete ? (
              <Alert className="bg-green-500/10 border-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  ✅ <strong>Validação concluída!</strong> Seus dados foram verificados e estão prontos para análise.
                </AlertDescription>
              </Alert>
            ) : validationProgress > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Validando dados...</span>
                  <span>{validationProgress}%</span>
                </div>
                <Progress value={validationProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Analisando suas métricas de receita, clientes e transações...
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Conecte suas APIs para iniciar a validação dos dados.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Important Information */}
      <Card className="mb-6 bg-blue-500/5 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h4 className="font-semibold mb-2">Segurança e Privacidade</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Seus dados são criptografados e protegidos</li>
                <li>• Usamos OAuth 2.0 para conexões seguras</li>
                <li>• Não armazenamos senhas ou tokens sensíveis</li>
                <li>• Você pode desconectar a qualquer momento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          ← Voltar
        </Button>
        <Button 
          onClick={handleNext}
          disabled={connectedCount === 0 || !validationComplete}
        >
          Continuar →
        </Button>
      </div>
      
    </WizardLayout>
  );
}