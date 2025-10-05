import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';

interface MonitoringReport {
  connectedAccountId: string;
  periodStart: string;
  periodEnd: string;
  mrrData: {
    current: number;
    previous: number;
    growth: number;
    growthPercentage: number;
  };
  churnData: {
    customerChurn: number;
    revenueChurn: number;
  };
  metricsData: {
    totalCustomers: number;
    newCustomers: number;
    cancelledCustomers: number;
    totalRevenue: number;
    averageRevenuePerUser: number;
  };
}

interface MonitoringServiceProps {
  connectedAccountId?: string;
  showAllAccounts?: boolean;
}

export function StripeMonitoringDashboard({ 
  connectedAccountId, 
  showAllAccounts = false 
}: MonitoringServiceProps) {
  const [report, setReport] = useState<MonitoringReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [runningJob, setRunningJob] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount / 100); // Stripe values are in cents
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const generateReport = async () => {
    if (!connectedAccountId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_report',
          connectedAccountId,
          months: 6,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const runMonthlyJob = async () => {
    setRunningJob(true);
    try {
      const response = await fetch('/api/stripe/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: showAllAccounts ? 'run_monthly_job' : 'run_account_monitoring',
          ...(connectedAccountId && { connectedAccountId }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run monitoring job');
      }

      const data = await response.json();
      console.log('Job completed:', data);
      
      // Refresh report if we have a specific account
      if (connectedAccountId && !showAllAccounts) {
        await generateReport();
      }
    } catch (error) {
      console.error('Error running monitoring job:', error);
    } finally {
      setRunningJob(false);
    }
  };

  useEffect(() => {
    if (connectedAccountId && !showAllAccounts) {
      generateReport();
    }
  }, [connectedAccountId, showAllAccounts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Stripe Monitoring Dashboard</h2>
        <div className="flex gap-2">
          {connectedAccountId && (
            <Button
              onClick={generateReport}
              disabled={loading}
              variant="outline"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar Relatório
            </Button>
          )}
          <Button
            onClick={runMonthlyJob}
            disabled={runningJob}
          >
            {runningJob && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {showAllAccounts ? 'Executar Job Mensal' : 'Executar Monitoramento'}
          </Button>
        </div>
      </div>

      {report && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MRR Atual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(report.mrrData.current)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {report.mrrData.growthPercentage >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={
                  report.mrrData.growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                }>
                  {formatPercentage(report.mrrData.growthPercentage)} em relação ao mês anterior
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {report.metricsData.totalCustomers}
              </div>
              <p className="text-xs text-muted-foreground">
                +{report.metricsData.newCustomers} novos clientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn de Clientes</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(report.churnData.customerChurn)}
              </div>
              <p className="text-xs text-muted-foreground">
                {report.metricsData.cancelledCustomers} cancelamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ARPU</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(report.metricsData.averageRevenuePerUser)}
              </div>
              <p className="text-xs text-muted-foreground">
                Receita média por usuário
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent>
          {report ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Período:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(report.periodStart).toLocaleDateString('pt-BR')} -{' '}
                  {new Date(report.periodEnd).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Crescimento MRR:</span>
                <Badge variant={report.mrrData.growth >= 0 ? 'default' : 'destructive'}>
                  {formatCurrency(report.mrrData.growth)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Churn de Receita:</span>
                <Badge variant="outline">
                  {formatPercentage(report.churnData.revenueChurn)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Receita Total:</span>
                <span className="text-sm font-bold">
                  {formatCurrency(report.metricsData.totalRevenue)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {connectedAccountId 
                  ? 'Carregue um relatório para ver as métricas'
                  : 'Selecione uma conta conectada para gerar relatório'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}