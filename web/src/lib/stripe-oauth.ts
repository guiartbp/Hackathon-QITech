/**
 * Stripe Connect OAuth utilities
 * Handles authorization URL generation and token management
 */

/**
 * Generates Stripe OAuth authorization URL
 * @param clientId Stripe Connect application client ID
 * @param redirectUri OAuth redirect URI
 * @param scope OAuth scope: 'read_only' or 'read_write'
 * @param state CSRF protection state parameter
 * @returns Complete authorization URL
 */
export function generateStripeAuthorizeUrl(
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

/**
 * Exchanges OAuth code for access token
 * @param code OAuth authorization code
 * @param clientSecret Stripe secret key
 * @returns Token response from Stripe
 */
export async function exchangeCodeForToken(
  code: string,
  clientSecret: string
): Promise<StripeTokenResponse> {
  const response = await fetch('https://connect.stripe.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Stripe OAuth error: ${response.status} - ${errorData}`);
  }

  return await response.json();
}

/**
 * Refreshes an expired access token
 * @param refreshToken The refresh token
 * @param clientSecret Stripe secret key
 * @returns New token response from Stripe
 */
export async function refreshAccessToken(
  refreshToken: string,
  clientSecret: string
): Promise<StripeTokenResponse> {
  const response = await fetch('https://connect.stripe.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Stripe token refresh error: ${response.status} - ${errorData}`);
  }

  return await response.json();
}

/**
 * Generates a secure random state parameter for CSRF protection
 * @returns Random state string
 */
export function generateOAuthState(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');
}

/**
 * Validates OAuth state parameter
 * @param receivedState State received from OAuth callback
 * @param expectedState State stored in session/cookie
 * @returns boolean indicating if state is valid
 */
export function validateOAuthState(receivedState: string, expectedState: string): boolean {
  return receivedState === expectedState && receivedState.length === 64;
}

// Types for Stripe OAuth responses
export interface StripeTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  stripe_publishable_key: string;
  stripe_user_id: string;
  scope: string;
  livemode: boolean;
}

export interface StripeAccount {
  id: string;
  object: string;
  business_profile?: {
    name?: string;
    url?: string;
  };
  capabilities?: {
    card_payments?: string;
    transfers?: string;
  };
  charges_enabled: boolean;
  country: string;
  default_currency: string;
  details_submitted: boolean;
  email?: string;
  payouts_enabled: boolean;
  requirements?: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
    pending_verification: string[];
  };
  type: string;
}