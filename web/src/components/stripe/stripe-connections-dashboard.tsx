'use client';

import { useState, useEffect } from 'react';
import { StripeConnectButton, ConnectedAccount } from './stripe-connect-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  CreditCard, 
  TrendingUp, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface StripeConnectionsProps {
  userId: string;
  userType: 'TOMADOR' | 'INVESTIDOR';
}

export function StripeConnectionsDashboard({ userId, userType }: StripeConnectionsProps) {
  const [connections, setConnections] = useState<{
    readOnly?: ConnectedAccount;
    readWrite?: ConnectedAccount;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);

  useEffect(() => {
    fetchConnections();
  }, [userId]);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API to fetch user's Stripe connections
      // For now, simulating with empty connections
      setConnections({});
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Erro ao carregar conexões');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectionSuccess = (account: ConnectedAccount) => {
    if (account.scope === 'read_only') {
      setConnections(prev => ({ ...prev, readOnly: account }));
    } else {
      setConnections(prev => ({ ...prev, readWrite: account }));
    }
    toast.success('Conta Stripe conectada com sucesso!');
    
    // Fetch account data if read_only connection
    if (account.scope === 'read_only') {
      fetchAccountData(account.id);
    }
  };

  const fetchAccountData = async (connectedAccountId: string) => {
    try {
      const response = await fetch('/api/stripe/repasse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fetch_account_data',
          connectedAccountId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAccountData(data.data);
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  const processTestRepasse = async () => {
    if (!connections.readWrite) {
      toast.error('Conexão de pagamento necessária');
      return;
    }

    try {
      const response = await fetch('/api/stripe/repasse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_transfer',
          investorAccountId: connections.readWrite.stripeUserId,
          transferAmountCents: 1000, // $10.00
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Repasse de teste processado com sucesso!');
      } else {
        toast.error(`Erro no repasse: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing repasse:', error);
      toast.error('Erro ao processar repasse');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando conexões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integração Stripe Connect</h2>
        <p className="text-muted-foreground">
          Gerencie suas conexões com Stripe para monitoramento e pagamentos
        </p>
      </div>

      {/* Connection Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoramento</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {connections.readOnly ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Conectado</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-600">Desconectado</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Leitura de métricas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {connections.readWrite ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Conectado</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-600">Desconectado</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Receber repasses
            </p>
          </CardContent>
        </Card>

        {accountData && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transações</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accountData.charges_count}</div>
                <p className="text-xs text-muted-foreground">
                  Total de cobranças
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(accountData.balance.available[0]?.amount || 0) / 100}
                </div>
                <p className="text-xs text-muted-foreground">
                  Disponível
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Connection Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monitoring Connection */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Conexão de Monitoramento</h3>
            <p className="text-sm text-muted-foreground">
              Permite leitura de dados para análise de MRR, churn e outras métricas
            </p>
          </div>
          <StripeConnectButton
            userId={userId}
            userType={userType}
            scope="read_only"
            existingConnection={connections.readOnly}
            onConnectionSuccess={handleConnectionSuccess}
          />
        </div>

        {/* Payment Connection */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Conexão de Pagamentos</h3>
            <p className="text-sm text-muted-foreground">
              Permite processar repasses de investimento e receber pagamentos
            </p>
          </div>
          <StripeConnectButton
            userId={userId}
            userType={userType}
            scope="read_write"
            existingConnection={connections.readWrite}
            onConnectionSuccess={handleConnectionSuccess}
          />
        </div>
      </div>

      {/* Account Information */}
      {accountData && (
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta Stripe</CardTitle>
            <CardDescription>
              Dados da sua conta conectada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium">Capabilities</h4>
                <div className="space-y-1 mt-1">
                  <Badge variant={accountData.account_info.charges_enabled ? 'default' : 'secondary'}>
                    Cobranças: {accountData.account_info.charges_enabled ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Badge variant={accountData.account_info.payouts_enabled ? 'default' : 'secondary'}>
                    Payouts: {accountData.account_info.payouts_enabled ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Saldo Detalhado</h4>
                <div className="space-y-1 mt-1 text-sm">
                  {accountData.balance.available.map((balance: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>{balance.currency.toUpperCase()}:</span>
                      <span>${(balance.amount / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Actions */}
      {(connections.readOnly || connections.readWrite) && (
        <Card>
          <CardHeader>
            <CardTitle>Ações de Teste</CardTitle>
            <CardDescription>
              Funcionalidades para testar a integração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              {connections.readOnly && (
                <Button 
                  variant="outline" 
                  onClick={() => fetchAccountData(connections.readOnly!.id)}
                >
                  Atualizar Dados
                </Button>
              )}
              
              {connections.readWrite && userType === 'INVESTIDOR' && (
                <Button 
                  variant="outline" 
                  onClick={processTestRepasse}
                >
                  Teste de Repasse ($10)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}