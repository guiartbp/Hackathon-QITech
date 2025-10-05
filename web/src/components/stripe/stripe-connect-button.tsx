'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export interface ConnectedAccount {
  id: string;
  stripeUserId: string;
  scope: 'read_only' | 'read_write';
  livemode: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StripeConnectButtonProps {
  userId: string;
  userType: 'TOMADOR' | 'INVESTIDOR';
  scope: 'read_only' | 'read_write';
  onConnectionSuccess?: (account: ConnectedAccount) => void;
  existingConnection?: ConnectedAccount;
}

export function StripeConnectButton({
  userId,
  userType,
  scope,
  onConnectionSuccess,
  existingConnection
}: StripeConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'loading'>('disconnected');

  useEffect(() => {
    if (existingConnection) {
      setConnectionStatus('connected');
    }
  }, [existingConnection]);

  const handleConnect = async () => {
    setIsLoading(true);
    
    try {
      // Generate authorization URL
      const response = await fetch('/api/stripe/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scope,
          userId,
          userType,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate authorization URL');
      }

      // Redirect to Stripe OAuth
      window.location.href = data.authorizeUrl;
      
    } catch (error) {
      console.error('Error connecting to Stripe:', error);
      toast.error('Falha ao conectar com Stripe. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScopeLabel = (scope: string) => {
    return scope === 'read_only' ? 'Monitoramento' : 'Pagamentos';
  };

  const getScopeDescription = (scope: string) => {
    return scope === 'read_only' 
      ? 'Permite leitura de dados para análise de métricas (MRR, churn, etc.)'
      : 'Permite processar pagamentos e repasses de investimento';
  };

  if (existingConnection) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Conta Conectada
          </CardTitle>
          <CardDescription>
            Stripe Connect configurado com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Escopo:</span>
              <Badge variant={scope === 'read_only' ? 'secondary' : 'default'}>
                {getScopeLabel(scope)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Ambiente:</span>
              <Badge variant={existingConnection.livemode ? 'destructive' : 'outline'}>
                {existingConnection.livemode ? 'Produção' : 'Teste'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={existingConnection.isActive ? 'default' : 'secondary'}>
                {existingConnection.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600">
              ID: {existingConnection.stripeUserId.slice(0, 20)}...
            </p>
            <p className="text-xs text-gray-600">
              Conectado em: {new Date(existingConnection.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {connectionStatus === 'loading' ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
          Conectar Stripe
        </CardTitle>
        <CardDescription>
          {getScopeDescription(scope)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Tipo de conexão:</span>
            <Badge variant={scope === 'read_only' ? 'secondary' : 'default'}>
              {getScopeLabel(scope)}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Usuário:</span>
            <Badge variant="outline">{userType}</Badge>
          </div>
        </div>

        <Button 
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Redirecionando...
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Conectar com Stripe
            </>
          )}
        </Button>

        <div className="text-xs text-gray-600 space-y-1">
          <p>• Você será redirecionado para o Stripe</p>
          <p>• Autorize o acesso conforme o escopo selecionado</p>
          <p>• Retornará automaticamente após a conexão</p>
        </div>
      </CardContent>
    </Card>
  );
}