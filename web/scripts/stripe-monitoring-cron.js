#!/usr/bin/env node

/**
 * Cron Job Script para Monitoramento Stripe
 * 
 * Este script pode ser executado via cron para automatizar o monitoramento mensal.
 * 
 * Configuração do cron (executar no primeiro dia de cada mês às 02:00):
 * 0 2 1 * * /path/to/node /path/to/your/project/scripts/stripe-monitoring-cron.js
 * 
 * Ou manualmente:
 * node scripts/stripe-monitoring-cron.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configurações
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOG_FILE = path.join(PROJECT_ROOT, 'logs', 'stripe-monitoring.log');
const API_ENDPOINT = process.env.NEXTJS_URL || 'http://localhost:3000';

// Função para logging
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  
  // Criar diretório de logs se não existir
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Função para fazer requisição HTTP
async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const https = require(url.startsWith('https:') ? 'https' : 'http');
    
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Função principal
async function runMonthlyMonitoring() {
  try {
    log('🚀 Iniciando job mensal de monitoramento Stripe...');
    
    // Verificar se o servidor está rodando
    try {
      const healthCheck = await makeRequest(`${API_ENDPOINT}/api/stripe/monitoring?action=health`);
      
      if (healthCheck.status !== 200) {
        throw new Error(`Health check failed with status: ${healthCheck.status}`);
      }
      
      log('✅ Servidor Next.js está respondendo');
    } catch (error) {
      log(`❌ Erro no health check: ${error.message}`);
      log('🔄 Tentando iniciar o servidor Next.js...');
      
      // Aqui você pode adicionar lógica para iniciar o servidor se necessário
      // Por exemplo, usando PM2 ou outro gerenciador de processo
      throw new Error('Servidor Next.js não está acessível');
    }
    
    // Executar o job mensal
    log('📊 Executando job mensal de monitoramento...');
    
    const response = await makeRequest(`${API_ENDPOINT}/api/stripe/monitoring`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'run_monthly_job'
      })
    });
    
    if (response.status !== 200) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    if (!response.data.success) {
      throw new Error(`Job failed: ${response.data.error || 'Unknown error'}`);
    }
    
    // Log dos resultados
    const summary = response.data.summary;
    log(`✅ Job mensal concluído com sucesso!`);
    log(`   📈 Contas processadas: ${summary.total_accounts}`);
    log(`   ✅ Sucessos: ${summary.successful}`);
    log(`   ❌ Falhas: ${summary.failed}`);
    
    if (summary.failed > 0) {
      log('⚠️  Algumas contas falharam no processamento. Verifique os logs da aplicação.');
    }
    
    // Gerar relatório resumido para cada conta processada
    if (response.data.results && response.data.results.length > 0) {
      log('📄 Detalhes dos resultados:');
      
      response.data.results.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        log(`   ${status} Conta ${index + 1}: ${result.connectedAccountId || 'N/A'}`);
        
        if (result.error) {
          log(`      Erro: ${result.error}`);
        }
        
        if (result.data) {
          log(`      MRR: R$ ${(result.data.mrr / 100).toFixed(2)}`);
          log(`      Clientes: ${result.data.customers}`);
        }
      });
    }
    
    log('🎉 Job mensal de monitoramento finalizado com sucesso!');
    
  } catch (error) {
    log(`❌ Erro durante execução do job mensal: ${error.message}`);
    log(`🔍 Stack trace: ${error.stack}`);
    
    // Aqui você pode adicionar notificações por email, Slack, etc.
    // await sendErrorNotification(error);
    
    process.exit(1);
  }
}

// Função para enviar notificações de erro (implementar conforme necessário)
async function sendErrorNotification(error) {
  log('📧 Enviando notificação de erro...');
  // TODO: Implementar notificação por email/Slack/Discord etc.
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Stripe Monitoring Cron Job

Uso:
  node scripts/stripe-monitoring-cron.js [opções]

Opções:
  --help, -h     Mostra esta ajuda
  --dry-run      Executa em modo de teste (não faz alterações)
  --verbose      Modo verboso (mais logs)

Variáveis de ambiente:
  NEXTJS_URL     URL do servidor Next.js (padrão: http://localhost:3000)

Exemplo de configuração do cron:
  # Executar todo dia 1° de cada mês às 02:00
  0 2 1 * * /usr/bin/node ${path.resolve(__filename)}
  `);
  process.exit(0);
}

if (args.includes('--dry-run')) {
  log('🧪 Modo de teste ativado - nenhuma alteração será feita');
  // TODO: Implementar modo dry-run
}

if (args.includes('--verbose')) {
  log('🔍 Modo verboso ativado');
}

// Executar o job
runMonthlyMonitoring().catch((error) => {
  log(`💥 Erro fatal: ${error.message}`);
  process.exit(1);
});