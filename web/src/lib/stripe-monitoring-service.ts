import { PrismaClient } from '@/generated/prisma';
import { StripeRepasseService } from './stripe-repasse-service';
import { decryptStripeTokens } from './crypto';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const repasseService = new StripeRepasseService();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: '2025-09-30.clover' 
});

export interface MonitoringJobResult {
  connectedAccountId: string;
  success: boolean;
  metrics?: {
    mrr: number;
    churnRate: number;
    newCustomers: number;
    totalCharges: number;
    totalRefunds: number;
  };
  error?: string;
}

/**
 * Serviço para jobs de monitoramento mensal usando tokens read_only
 */
export class StripeMonitoringService {

  /**
   * Executa job mensal para todas as contas com scope read_only
   */
  async runMonthlyJob(): Promise<MonitoringJobResult[]> {
    console.log('🔄 Starting monthly monitoring job...');
    
    const readOnlyAccounts = await prisma.connectedAccount.findMany({
      where: {
        scope: 'read_only',
        isActive: true,
      },
    });

    console.log(`📊 Found ${readOnlyAccounts.length} read-only accounts to process`);

    const results: MonitoringJobResult[] = [];

    for (const account of readOnlyAccounts) {
      try {
        const result = await this.processAccountMonitoring(account);
        results.push(result);
      } catch (error) {
        console.error(`❌ Error processing account ${account.id}:`, error);
        results.push({
          connectedAccountId: account.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(`✅ Monthly job completed. Processed: ${results.length} accounts`);
    return results;
  }

  /**
   * Processa monitoramento para uma conta específica
   */
  async processAccountMonitoring(account: any): Promise<MonitoringJobResult> {
    console.log(`📈 Processing monitoring for account: ${account.stripeUserId}`);

    // Calcular período (mês anterior)
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);

    try {
      // Descriptografar tokens
      const { accessToken } = decryptStripeTokens(
        account.accessToken,
        account.refreshToken
      );

      // Criar instância Stripe com token da conta conectada
      const accountStripe = new Stripe(accessToken, { 
        apiVersion: '2025-09-30.clover' 
      });

      // Coletar dados do período
      const [charges, customers, invoices] = await Promise.all([
        this.getChargesForPeriod(accountStripe, startDate, endDate),
        this.getCustomersForPeriod(accountStripe, startDate, endDate),
        this.getInvoicesForPeriod(accountStripe, startDate, endDate),
      ]);

      // Calcular métricas
      const metrics = this.calculateMetrics(charges, customers, invoices, startDate, endDate);

      // Salvar no banco (quando modelo StripeMonitoringData estiver ativo)
      /*
      await prisma.stripeMonitoringData.upsert({
        where: {
          connectedAccountId_period: {
            connectedAccountId: account.id,
            period: startDate,
          }
        },
        create: {
          connectedAccountId: account.id,
          period: startDate,
          ...metrics,
          rawData: {
            charges: charges.length,
            customers: customers.length,
            invoices: invoices.length,
          },
        },
        update: {
          ...metrics,
          collectedAt: new Date(),
        },
      });
      */

      // Atualizar timestamp da última sincronização
      await prisma.connectedAccount.update({
        where: { id: account.id },
        data: { updatedAt: new Date() },
      });

      console.log(`✅ Successfully processed account: ${account.stripeUserId}`);

      return {
        connectedAccountId: account.id,
        success: true,
        metrics,
      };

    } catch (error) {
      console.error(`❌ Error processing account ${account.stripeUserId}:`, error);
      
      // Se erro de autorização, marcar conta como inativa
      if (error instanceof Error && error.message.includes('unauthorized')) {
        await prisma.connectedAccount.update({
          where: { id: account.id },
          data: { isActive: false },
        });
      }

      return {
        connectedAccountId: account.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Buscar charges do período
   */
  private async getChargesForPeriod(
    accountStripe: Stripe,
    startDate: Date,
    endDate: Date
  ) {
    const charges: Stripe.Charge[] = [];
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const response = await accountStripe.charges.list({
        created: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
        limit: 100,
        starting_after: startingAfter,
      });

      charges.push(...response.data);
      hasMore = response.has_more;
      
      if (hasMore && response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    return charges;
  }

  /**
   * Buscar customers do período
   */
  private async getCustomersForPeriod(
    accountStripe: Stripe,
    startDate: Date,
    endDate: Date
  ) {
    const customers: Stripe.Customer[] = [];
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const response = await accountStripe.customers.list({
        created: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
        limit: 100,
        starting_after: startingAfter,
      });

      customers.push(...response.data);
      hasMore = response.has_more;
      
      if (hasMore && response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    return customers;
  }

  /**
   * Buscar invoices do período
   */
  private async getInvoicesForPeriod(
    accountStripe: Stripe,
    startDate: Date,
    endDate: Date
  ) {
    const invoices: Stripe.Invoice[] = [];
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const response = await accountStripe.invoices.list({
        created: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
        limit: 100,
        starting_after: startingAfter,
      });

      invoices.push(...response.data);
      hasMore = response.has_more;
      
      if (hasMore && response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    return invoices;
  }

  /**
   * Calcular métricas baseado nos dados coletados
   */
  private calculateMetrics(
    charges: Stripe.Charge[],
    customers: Stripe.Customer[],
    invoices: Stripe.Invoice[],
    startDate: Date,
    endDate: Date
  ) {
    // Total charges bem-sucedidos
    const successfulCharges = charges.filter(c => c.status === 'succeeded');
    const totalCharges = successfulCharges.reduce((sum, charge) => 
      sum + (charge.amount_captured || 0), 0
    ) / 100; // Converter de centavos

    // Total refunds
    const totalRefunds = charges
      .filter(c => c.refunded)
      .reduce((sum, charge) => sum + (charge.amount_refunded || 0), 0) / 100;

    // Novos customers
    const newCustomers = customers.length;

    // MRR calculation (simplified - based on invoices)
    // Na prática, seria melhor usar subscriptions
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    
    const mrr = paidInvoices.reduce((sum, invoice) => 
      sum + (invoice.amount_paid || 0), 0
    ) / 100;

    // Churn Rate (simplified calculation)
    // Seria necessário mais dados históricos para cálculo preciso
    const churnRate = 0; // TODO: Implementar lógica de churn real

    return {
      mrr,
      churnRate,
      newCustomers,
      totalCharges,
      totalRefunds,
      disputesCount: charges.filter(c => c.disputed).length,
    };
  }

  /**
   * Executar job de monitoramento para conta específica
   */
  async runAccountMonitoring(connectedAccountId: string): Promise<MonitoringJobResult> {
    const account = await prisma.connectedAccount.findUnique({
      where: { id: connectedAccountId },
    });

    if (!account) {
      throw new Error('Connected account not found');
    }

    if (account.scope !== 'read_only') {
      throw new Error('Account must have read_only scope for monitoring');
    }

    return await this.processAccountMonitoring(account);
  }

  /**
   * Gerar relatório de monitoramento
   */
  async generateMonitoringReport(
    connectedAccountId: string,
    months: number = 6
  ) {
    // TODO: Implementar quando modelo StripeMonitoringData estiver ativo
    /*
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);

    const data = await prisma.stripeMonitoringData.findMany({
      where: {
        connectedAccountId,
        period: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        period: 'desc',
      },
    });

    return {
      accountId: connectedAccountId,
      period: { startDate, endDate },
      data,
      summary: {
        averageMrr: data.reduce((sum, d) => sum + (d.mrr || 0), 0) / data.length,
        averageChurn: data.reduce((sum, d) => sum + (d.churnRate || 0), 0) / data.length,
        totalNewCustomers: data.reduce((sum, d) => sum + (d.newCustomers || 0), 0),
        totalRevenue: data.reduce((sum, d) => sum + (d.totalCharges || 0), 0),
      },
    };
    */

    return {
      accountId: connectedAccountId,
      message: 'Monitoring report will be available when StripeMonitoringData model is active'
    };
  }
}

// Export singleton instance
export const monitoringService = new StripeMonitoringService();