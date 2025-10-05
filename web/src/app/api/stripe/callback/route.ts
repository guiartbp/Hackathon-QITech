import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, validateOAuthState } from '@/lib/stripe-oauth';
import { encryptStripeTokens } from '@/lib/crypto';
import { PrismaClient } from '@/generated/prisma';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-09-30.clover' });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Stripe OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}/dashboard?error=stripe_auth_denied`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}/dashboard?error=missing_params`
      );
    }

    // Extrair dados do state
    const stateParts = state.split(':');
    if (stateParts.length !== 4) {
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}/dashboard?error=invalid_state_format`
      );
    }

    const [stateValue, userId, userType, scope] = stateParts;
    
    // Validar state (opcional: verificar com cookie se implementado)
    if (!stateValue || stateValue.length !== 64) {
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}/dashboard?error=invalid_state`
      );
    }

    // Trocar code por token
    const tokenData = await exchangeCodeForToken(
      code, 
      process.env.STRIPE_SECRET_KEY!
    );

    // Obter informações da conta conectada
    let accountInfo = null;
    try {
      accountInfo = await stripe.accounts.retrieve(tokenData.stripe_user_id);
    } catch (accountError) {
      console.warn('Could not retrieve account info:', accountError);
    }

    // Criptografar tokens
    const { accessToken: encryptedAccessToken, refreshToken: encryptedRefreshToken } = 
      encryptStripeTokens(tokenData.access_token, tokenData.refresh_token);

    // Salvar dados da conta conectada no banco
    const connectedAccount = await prisma.connectedAccount.upsert({
      where: {
        stripeUserId: tokenData.stripe_user_id,
      },
      update: {
        scope: tokenData.scope,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        livemode: tokenData.livemode,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        stripeUserId: tokenData.stripe_user_id,
        scope: tokenData.scope,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        livemode: tokenData.livemode,
        isActive: true,
      },
    });

    console.log('Conta Stripe conectada com sucesso:', {
      id: connectedAccount.id,
      stripeUserId: connectedAccount.stripeUserId,
      scope: connectedAccount.scope,
      userId,
      userType,
    });

    // Redirecionar com sucesso
    const response = NextResponse.redirect(
      `${process.env.BETTER_AUTH_URL}/dashboard?success=stripe_connected&scope=${tokenData.scope}&user_type=${userType}`
    );
    
    // Limpar cookie de state se existir
    response.cookies.delete('stripe_oauth_state');

    return response;

  } catch (error) {
    console.error('Erro no callback do Stripe:', error);
    return NextResponse.redirect(
      `${process.env.BETTER_AUTH_URL}/dashboard?error=callback_failed&details=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`
    );
  }
}