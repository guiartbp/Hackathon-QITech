import { NextRequest, NextResponse } from 'next/server';
import { generateStripeAuthorizeUrl, generateOAuthState } from '@/lib/stripe-oauth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') as 'read_only' | 'read_write';
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType'); // 'TOMADOR' ou 'INVESTIDOR'

    // Validação dos parâmetros
    if (!scope || !['read_only', 'read_write'].includes(scope)) {
      return NextResponse.json(
        { error: 'Invalid scope. Must be read_only or read_write' },
        { status: 400 }
      );
    }

    if (!userId || !userType) {
      return NextResponse.json(
        { error: 'userId and userType are required' },
        { status: 400 }
      );
    }

    // Validação das variáveis de ambiente
    const clientId = process.env.STRIPE_CLIENT_ID;
    const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Stripe configuration missing' },
        { status: 500 }
      );
    }

    // Gerar state para proteção CSRF
    const state = generateOAuthState();
    
    // URL de redirecionamento
    const redirectUri = `${baseUrl}/api/stripe/callback`;
    
    // Gerar URL de autorização
    const authorizeUrl = generateStripeAuthorizeUrl(
      clientId,
      redirectUri,
      scope,
      `${state}:${userId}:${userType}:${scope}` // Incluir dados no state
    );

    // Retornar URL e state (client deve armazenar o state para validação)
    return NextResponse.json({
      authorizeUrl,
      state,
      redirectUri,
      scope,
      userId,
      userType
    });

  } catch (error) {
    console.error('Error generating Stripe authorization URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scope, userId, userType } = body;

    // Validação dos parâmetros
    if (!scope || !['read_only', 'read_write'].includes(scope)) {
      return NextResponse.json(
        { error: 'Invalid scope. Must be read_only or read_write' },
        { status: 400 }
      );
    }

    if (!userId || !userType) {
      return NextResponse.json(
        { error: 'userId and userType are required' },
        { status: 400 }
      );
    }

    // Validação das variáveis de ambiente
    const clientId = process.env.STRIPE_CLIENT_ID;
    const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Stripe configuration missing' },
        { status: 500 }
      );
    }

    // Gerar state para proteção CSRF
    const state = generateOAuthState();
    
    // URL de redirecionamento
    const redirectUri = `${baseUrl}/api/stripe/callback`;
    
    // Gerar URL de autorização
    const authorizeUrl = generateStripeAuthorizeUrl(
      clientId,
      redirectUri,
      scope,
      `${state}:${userId}:${userType}:${scope}` // Incluir dados no state
    );

    // Criar response com cookie de estado
    const response = NextResponse.json({
      authorizeUrl,
      state,
      redirectUri,
      scope,
      userId,
      userType
    });

    // Salvar state em cookie para validação posterior
    response.cookies.set('stripe_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutos
    });

    return response;

  } catch (error) {
    console.error('Error generating Stripe authorization URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}