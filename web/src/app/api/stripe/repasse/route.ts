import { NextRequest, NextResponse } from 'next/server';
import { StripeRepasseService } from '@/lib/stripe-repasse-service';

const repasseService = new StripeRepasseService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      action, 
      smartContractId, 
      totalAmountCents, 
      paymentMethod = 'transfer' 
    } = body;

    switch (action) {
      case 'process_investment_repasses':
        if (!smartContractId || !totalAmountCents) {
          return NextResponse.json(
            { error: 'smartContractId and totalAmountCents are required' },
            { status: 400 }
          );
        }

        const results = await repasseService.processInvestmentRepasses(
          smartContractId,
          totalAmountCents,
          paymentMethod
        );

        return NextResponse.json({
          success: true,
          results,
          summary: {
            total_processed: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
          },
        });

      case 'create_destination_charge':
        const { 
          tomadorAccountId, 
          investorAccountId, 
          amountCents, 
          applicationFeeCents 
        } = body;

        if (!tomadorAccountId || !investorAccountId || !amountCents) {
          return NextResponse.json(
            { error: 'tomadorAccountId, investorAccountId and amountCents are required' },
            { status: 400 }
          );
        }

        const paymentIntent = await repasseService.createDestinationCharge(
          tomadorAccountId,
          investorAccountId,
          amountCents,
          'usd',
          applicationFeeCents
        );

        return NextResponse.json({
          success: true,
          paymentIntent: {
            id: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
          },
        });

      case 'create_transfer':
        const { investorAccountId: transferInvestorId, transferAmountCents } = body;

        if (!transferInvestorId || !transferAmountCents) {
          return NextResponse.json(
            { error: 'investorAccountId and transferAmountCents are required' },
            { status: 400 }
          );
        }

        const transfer = await repasseService.createTransfer(
          transferInvestorId,
          transferAmountCents
        );

        return NextResponse.json({
          success: true,
          transfer: {
            id: transfer.id,
            amount: transfer.amount,
            currency: transfer.currency,
            destination: transfer.destination,
          },
        });

      case 'fetch_account_data':
        const { connectedAccountId } = body;

        if (!connectedAccountId) {
          return NextResponse.json(
            { error: 'connectedAccountId is required' },
            { status: 400 }
          );
        }

        const accountData = await repasseService.fetchAccountData(connectedAccountId);

        return NextResponse.json({
          success: true,
          data: {
            charges_count: accountData.charges.length,
            balance: accountData.balance,
            account_info: {
              id: accountData.accountInfo.id,
              charges_enabled: accountData.accountInfo.charges_enabled,
              payouts_enabled: accountData.accountInfo.payouts_enabled,
              capabilities: accountData.accountInfo.capabilities,
            },
          },
        });

      case 'calculate_metrics':
        const { 
          metricsConnectedAccountId, 
          startDate, 
          endDate 
        } = body;

        if (!metricsConnectedAccountId || !startDate || !endDate) {
          return NextResponse.json(
            { error: 'connectedAccountId, startDate and endDate are required' },
            { status: 400 }
          );
        }

        const metrics = await repasseService.calculateAccountMetrics(
          metricsConnectedAccountId,
          new Date(startDate),
          new Date(endDate)
        );

        return NextResponse.json({
          success: true,
          metrics,
        });

      case 'validate_account':
        const { stripeAccountId } = body;

        if (!stripeAccountId) {
          return NextResponse.json(
            { error: 'stripeAccountId is required' },
            { status: 400 }
          );
        }

        const validation = await repasseService.validateAccountCapabilities(stripeAccountId);

        return NextResponse.json({
          success: true,
          validation,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in repasse service:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'health') {
      return NextResponse.json({
        success: true,
        message: 'Stripe Repasse Service is healthy',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid action for GET request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in repasse service GET:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}