import { NextRequest, NextResponse } from 'next/server';
import { monitoringService } from '@/lib/stripe-monitoring-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, connectedAccountId, months } = body;

    switch (action) {
      case 'run_monthly_job':
        const results = await monitoringService.runMonthlyJob();
        
        return NextResponse.json({
          success: true,
          message: 'Monthly monitoring job completed',
          results,
          summary: {
            total_accounts: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
          },
        });

      case 'run_account_monitoring':
        if (!connectedAccountId) {
          return NextResponse.json(
            { error: 'connectedAccountId is required' },
            { status: 400 }
          );
        }

        const result = await monitoringService.runAccountMonitoring(connectedAccountId);
        
        return NextResponse.json({
          success: true,
          message: 'Account monitoring completed',
          result,
        });

      case 'generate_report':
        if (!connectedAccountId) {
          return NextResponse.json(
            { error: 'connectedAccountId is required' },
            { status: 400 }
          );
        }

        const report = await monitoringService.generateMonitoringReport(
          connectedAccountId,
          months || 6
        );

        return NextResponse.json({
          success: true,
          report,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in monitoring service:', error);
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
        message: 'Stripe Monitoring Service is healthy',
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'status') {
      // TODO: Implementar status das contas conectadas
      return NextResponse.json({
        success: true,
        message: 'Status endpoint - TODO: implement account status check',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action for GET request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in monitoring service GET:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}