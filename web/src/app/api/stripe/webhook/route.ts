import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: '2025-09-30.clover' 
});

// Eventos relevantes para processar
const RELEVANT_EVENTS = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'charge.succeeded',
  'charge.failed',
  'charge.refunded',
  'transfer.created',
  'transfer.updated',
  'transfer.failed',
  'payout.created',
  'payout.updated',
  'payout.failed',
  'account.updated',
  'balance.available',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.created',
  'customer.updated',
] as const;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // Verificar assinatura do webhook
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log(`Received webhook event: ${event.type} (${event.id})`);

  try {
    // Verificar se já processamos este evento (usando cache simples por agora)
    // TODO: Implementar verificação de evento duplicado quando modelo StripeWebhookEvent estiver ativo

    // Processar apenas eventos relevantes
    if (RELEVANT_EVENTS.includes(event.type as any)) {
      await processWebhookEvent(event);
    }

    return NextResponse.json({ received: true, status: 'processed' });

  } catch (error) {
    console.error(`Error processing webhook ${event.id}:`, error);
    
    // Retornar erro 500 para que Stripe tente reenviar
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Processa eventos específicos do webhook
 */
async function processWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    case 'charge.succeeded':
      await handleChargeSucceeded(event.data.object as Stripe.Charge);
      break;

    case 'transfer.created':
    case 'transfer.updated':
      await handleTransferUpdate(event.data.object as Stripe.Transfer);
      break;

    case 'account.updated':
      await handleAccountUpdated(event.data.object as Stripe.Account);
      break;

    case 'balance.available':
      await handleBalanceAvailable(event.data.object as Stripe.Balance);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Handler para pagamentos bem-sucedidos
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  // Atualizar logs de repasse relacionados
  await prisma.repasseLog.updateMany({
    where: {
      stripePaymentIntentId: paymentIntent.id,
      status: 'PENDING'
    },
    data: {
      status: 'COMPLETED',
      metadata: {
        ...paymentIntent.metadata,
        webhook_processed_at: new Date().toISOString(),
      }
    }
  });

  // TODO: Processar lógica específica do investimento
  // - Calcular repasses baseado no smart contract
  // - Distribuir para investidores
}

/**
 * Handler para pagamentos falhos
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);

  // Marcar repasses como falhados
  await prisma.repasseLog.updateMany({
    where: {
      stripePaymentIntentId: paymentIntent.id,
      status: 'PROCESSING'
    },
    data: {
      status: 'FAILED',
      metadata: {
        error: paymentIntent.last_payment_error?.message,
        webhook_processed_at: new Date().toISOString(),
      }
    }
  });
}

/**
 * Handler para charges bem-sucedidos
 */
async function handleChargeSucceeded(charge: Stripe.Charge) {
  console.log('Charge succeeded:', charge.id, 'Amount:', charge.amount);
  
  // TODO: Implementar lógica de monitoramento quando modelo StripeMonitoringData estiver ativo
  // Por agora apenas logamos o evento
}

/**
 * Handler para updates de transfer
 */
async function handleTransferUpdate(transfer: Stripe.Transfer) {
  console.log('Transfer updated:', transfer.id);

  await prisma.repasseLog.updateMany({
    where: {
      stripeTransferId: transfer.id
    },
    data: {
      status: 'COMPLETED',
      metadata: {
        webhook_processed_at: new Date().toISOString(),
      }
    }
  });
}

/**
 * Handler para transfers falhados
 */
async function handleTransferFailed(transfer: Stripe.Transfer) {
  console.log('Transfer failed:', transfer.id);

  await prisma.repasseLog.updateMany({
    where: {
      stripeTransferId: transfer.id
    },
    data: {
      status: 'FAILED',
      metadata: {
        webhook_processed_at: new Date().toISOString(),
      }
    }
  });
}

/**
 * Handler para updates de conta
 */
async function handleAccountUpdated(account: Stripe.Account) {
  console.log('Account updated:', account.id);

  // Atualizar informações da conta conectada
  await prisma.connectedAccount.updateMany({
    where: {
      stripeUserId: account.id
    },
    data: {
      // Atualizar campos relevantes baseado no update da conta
      updatedAt: new Date(),
    }
  });
}

/**
 * Handler para balance disponível
 */
async function handleBalanceAvailable(balance: Stripe.Balance) {
  console.log('Balance available updated');
  
  // Aqui você pode implementar lógica para:
  // - Notificar sobre saldo disponível
  // - Processar repasses automáticos
  // - Atualizar métricas de liquidez
}