import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export { stripe };

export function stripeAuthorizeUrl(
  clientId: string, 
  redirectUri: string, 
  scope: 'read_only' | 'read_write', 
  state: string
): string {
  const url = new URL('https://connect.stripe.com/oauth/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('scope', scope);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  return url.toString();
}

export async function exchangeCodeForToken(code: string) {
  const response = await fetch('https://connect.stripe.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_secret: process.env.STRIPE_SECRET_KEY!,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
}

export async function refreshStripeToken(refreshToken: string) {
  const response = await fetch('https://connect.stripe.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_secret: process.env.STRIPE_SECRET_KEY!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

// Criar charge com repasse para conta conectada (destination charge)
export async function createDestinationCharge(
  amountCents: number,
  currency: string,
  paymentMethodId: string,
  connectedAccountId: string,
  applicationFeeAmount?: number
) {
  return stripe.paymentIntents.create({
    amount: amountCents,
    currency,
    payment_method: paymentMethodId,
    confirm: true,
    transfer_data: {
      destination: connectedAccountId,
    },
    ...(applicationFeeAmount && { application_fee_amount: applicationFeeAmount }),
  });
}

// Transferir fundos para conta conectada
export async function transferToConnectedAccount(
  amountCents: number,
  currency: string,
  connectedAccountId: string
) {
  return stripe.transfers.create({
    amount: amountCents,
    currency,
    destination: connectedAccountId,
  });
}

// Buscar dados de uma conta conectada usando access token
export async function getConnectedAccountData(accessToken: string) {
  const connectedStripe = new Stripe(accessToken, {
    apiVersion: '2025-09-30.clover',
  });

  // Exemplo: buscar charges da conta conectada
  const charges = await connectedStripe.charges.list({ limit: 100 });
  const balance = await connectedStripe.balance.retrieve();
  
  return {
    charges: charges.data,
    balance,
  };
}