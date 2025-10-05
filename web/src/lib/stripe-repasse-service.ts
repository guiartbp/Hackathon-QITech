import Stripe from 'stripe';
import { PrismaClient } from '@/generated/prisma';
import { decryptStripeTokens } from '@/lib/crypto';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: '2025-09-30.clover' 
});

export interface InvestmentRepasse {
  investorId: string;
  amount: number; // em centavos
  percentage: number;
  smartContractId: string;
}

export interface RepasseResult {
  success: boolean;
  repasseLogId?: string;
  stripePaymentIntentId?: string;
  stripeTransferId?: string;
  error?: string;
}

/**
 * Serviço principal para processamento de repasses de investimento
 */
export class StripeRepasseService {
  
  /**
   * Criar cobrança com destination charge (plataforma coleta e repassa automaticamente)
   * @param tomadorStripeAccountId Conta Stripe do tomador
   * @param investorStripeAccountId Conta Stripe do investidor  
   * @param amountCents Valor em centavos
   * @param currency Moeda (default: usd)
   * @param applicationFeeCents Taxa da plataforma em centavos
   * @param metadata Metadados do pagamento
   */
  async createDestinationCharge(
    tomadorStripeAccountId: string,
    investorStripeAccountId: string,
    amountCents: number,
    currency: string = 'usd',
    applicationFeeCents?: number,
    metadata?: Record<string, string>
  ): Promise<Stripe.PaymentIntent> {
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency,
      transfer_data: {
        destination: investorStripeAccountId,
      },
      application_fee_amount: applicationFeeCents,
      metadata: {
        tomador_account: tomadorStripeAccountId,
        investor_account: investorStripeAccountId,
        ...metadata,
      },
    });

    return paymentIntent;
  }

  /**
   * Processar repasse usando transfers (após pagamento já estar na plataforma)
   * @param investorStripeAccountId Conta do investidor destino
   * @param amountCents Valor em centavos a transferir
   * @param currency Moeda
   * @param metadata Metadados da transferência
   */
  async createTransfer(
    investorStripeAccountId: string,
    amountCents: number,
    currency: string = 'usd',
    metadata?: Record<string, string>
  ): Promise<Stripe.Transfer> {
    
    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency,
      destination: investorStripeAccountId,
      metadata: {
        ...metadata,
      },
    });

    return transfer;
  }

  /**
   * Processar múltiplos repasses baseado em dados do smart contract
   * @param smartContractId ID do contrato inteligente
   * @param totalAmountCents Valor total a ser distribuído
   * @param paymentMethod Método: 'destination_charge' ou 'transfer'
   */
  async processInvestmentRepasses(
    smartContractId: string,
    totalAmountCents: number,
    paymentMethod: 'destination_charge' | 'transfer' = 'transfer'
  ): Promise<RepasseResult[]> {
    
    // Buscar informações do contrato
    const smartContract = await prisma.smartContract.findUnique({
      where: { id: smartContractId },
      include: {
        investorSignatures: true,
      },
    });

    if (!smartContract) {
      throw new Error('Smart contract not found');
    }

    if (!smartContract.isActive) {
      throw new Error('Smart contract is not active');
    }

    const results: RepasseResult[] = [];

    // Processar cada investidor
    for (const signature of smartContract.investorSignatures) {
      try {
        // Calcular valor do repasse baseado na porcentagem
        const repasseAmount = Math.floor(
          (totalAmountCents * parseFloat(signature.percentage.toString())) / 100
        );

        // Buscar conta conectada do investidor
        const connectedAccount = await prisma.connectedAccount.findFirst({
          where: {
            userId: signature.investorId,
            scope: 'read_write', // Precisa de escopo de escrita para receber transfers
            isActive: true,
          },
        });

        if (!connectedAccount) {
          results.push({
            success: false,
            error: `No active Stripe account found for investor ${signature.investorId}`,
          });
          continue;
        }

        // Para simplicidade, vou criar um repasse genérico
        // Na implementação real, você precisará de pagamentoId e investimentoId válidos
        const repasse = await prisma.repasse.create({
          data: {
            pagamentoId: 'temp_payment_id', // TODO: usar pagamento real
            investimentoId: 'temp_investment_id', // TODO: usar investimento real  
            investidorId: signature.investorId,
            connectedAccountId: connectedAccount.id,
            valorRepasse: repasseAmount / 100,
            status: 'PROCESSANDO',
          },
        });

        // Criar log de repasse
        const repasseLog = await prisma.repasseLog.create({
          data: {
            repasseId: repasse.id,
            amount: repasseAmount / 100, // Converter para moeda
            currency: 'usd',
            status: 'PROCESSING',
            metadata: {
              investor_id: signature.investorId,
              signature_percentage: signature.percentage.toString(),
              total_amount_cents: totalAmountCents,
              smart_contract_id: smartContractId,
              connected_account_id: connectedAccount.id,
              payment_method: paymentMethod,
            },
          },
        });

        if (paymentMethod === 'transfer') {
          // Processar como transfer
          const transfer = await this.createTransfer(
            connectedAccount.stripeUserId,
            repasseAmount,
            'usd',
            {
              repasse_log_id: repasseLog.id,
              smart_contract_id: smartContractId,
              investor_id: signature.investorId,
            }
          );

          // Atualizar log com ID do transfer
          await prisma.repasseLog.update({
            where: { id: repasseLog.id },
            data: {
              stripeTransferId: transfer.id,
              status: 'COMPLETED',
            },
          });

          results.push({
            success: true,
            repasseLogId: repasseLog.id,
            stripeTransferId: transfer.id,
          });

        } else {
          // Destination charge seria criado pelo frontend/cliente
          // Aqui apenas registramos a intenção
          results.push({
            success: true,
            repasseLogId: repasseLog.id,
          });
        }

      } catch (error) {
        console.error(`Error processing repasse for investor ${signature.investorId}:`, error);
        
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Ler dados de uma conta conectada usando token read_only
   * @param connectedAccountId ID da conta conectada
   */
  async fetchAccountData(connectedAccountId: string) {
    const connectedAccount = await prisma.connectedAccount.findUnique({
      where: { id: connectedAccountId },
    });

    if (!connectedAccount) {
      throw new Error('Connected account not found');
    }

    // Descriptografar tokens
    const { accessToken } = decryptStripeTokens(
      connectedAccount.accessToken,
      connectedAccount.refreshToken
    );

    // Criar instância Stripe com token da conta conectada
    const accountStripe = new Stripe(accessToken, { 
      apiVersion: '2025-09-30.clover' 
    });

    // Buscar dados (charges, invoices, etc.)
    const charges = await accountStripe.charges.list({ limit: 100 });
    const balance = await accountStripe.balance.retrieve();

    return {
      charges: charges.data,
      balance,
      accountInfo: await stripe.accounts.retrieve(connectedAccount.stripeUserId),
    };
  }

  /**
   * Calcular MRR e métricas de uma conta conectada
   * @param connectedAccountId ID da conta conectada
   * @param startDate Data início do período
   * @param endDate Data fim do período
   */
  async calculateAccountMetrics(
    connectedAccountId: string,
    startDate: Date,
    endDate: Date
  ) {
    const accountData = await this.fetchAccountData(connectedAccountId);
    
    // Filtrar charges do período
    const periodCharges = accountData.charges.filter(charge => {
      const chargeDate = new Date(charge.created * 1000);
      return chargeDate >= startDate && chargeDate <= endDate;
    });

    // Calcular métricas básicas
    const totalRevenue = periodCharges.reduce((sum, charge) => 
      sum + (charge.amount_captured || 0), 0
    ) / 100; // Converter centavos para moeda

    const totalCharges = periodCharges.length;
    const successfulCharges = periodCharges.filter(c => c.status === 'succeeded').length;
    const failedCharges = totalCharges - successfulCharges;

    return {
      period: { startDate, endDate },
      totalRevenue,
      totalCharges,
      successfulCharges,
      failedCharges,
      averageTransactionValue: totalCharges > 0 ? totalRevenue / totalCharges : 0,
      successRate: totalCharges > 0 ? successfulCharges / totalCharges : 0,
    };
  }

  /**
   * Validar se uma conta tem capabilities necessárias para repasses
   * @param stripeAccountId ID da conta Stripe
   */
  async validateAccountCapabilities(stripeAccountId: string) {
    const account = await stripe.accounts.retrieve(stripeAccountId);
    
    const requiredCapabilities = ['transfers', 'card_payments'];
    const missingCapabilities = requiredCapabilities.filter(cap => 
      !account.capabilities?.[cap as keyof typeof account.capabilities] || 
      account.capabilities[cap as keyof typeof account.capabilities] !== 'active'
    );

    return {
      isValid: missingCapabilities.length === 0,
      missingCapabilities,
      account: {
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
      },
    };
  }
}