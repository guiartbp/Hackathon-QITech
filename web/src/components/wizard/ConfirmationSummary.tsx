import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';

interface WizardData {
  valorSolicitado: number;
  proposito: string;
  detalhamento?: string;
}

interface SimulationData {
  valor_solicitado: number;
  taxa_juros_mensal?: number;
  taxa_juros_anual?: number;
  prazo_meses?: number;
  valor_parcela?: number;
  valor_total?: number;
  custo_total: number;
  primeira_parcela: string;
  // Additional fields for the new structure
  multiplo_cap?: number;
  percentual_mrr?: number;
  mrr_atual?: number;
  valor_total_retorno?: number;
  projecoes?: {
    cenario: 'conservador' | 'base' | 'otimista';
    crescimento_mrr_mensal: number;
    prazo_estimado_meses: number;
    cronograma: {
      mes: number;
      data: string;
      mrr_projetado: number;
      valor_parcela: number;
      acumulado_pago: number;
      saldo_restante: number;
    }[];
  }[];
}

interface ConfirmationSummaryProps {
  wizardData: WizardData;
  simulation: SimulationData;
}

const getPropositoLabel = (proposito: string) => {
  const labels = {
    marketing: '📢 Marketing e Aquisição',
    contratacoes: '👥 Contratações',
    infraestrutura: '☁️ Infraestrutura',
    produto: '🛠️ Desenvolvimento de Produto'
  };
  return labels[proposito as keyof typeof labels] || proposito;
};

export function ConfirmationSummary({ wizardData, simulation }: ConfirmationSummaryProps) {
  // Get base scenario for display
  const cenarioBase = simulation.projecoes?.find(p => p.cenario === 'base') || simulation.projecoes?.[0];
  const mrrAtual = simulation.mrr_atual || 0;
  
  return (
    <div className="space-y-6">
      {/* Request Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Solicitação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor Solicitado:</span>
            <span className="font-semibold text-xl text-primary">
              {formatCurrency(wizardData.valorSolicitado)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Finalidade:</span>
            <span className="font-semibold">
              {getPropositoLabel(wizardData.proposito)}
            </span>
          </div>
          
          {wizardData.detalhamento && (
            <div>
              <span className="text-muted-foreground block mb-2">Detalhamento:</span>
              <p className="text-sm bg-muted p-3 rounded-lg">
                {wizardData.detalhamento}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RBF Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Condições RBF (Revenue-Based Financing)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">% do MRR</p>
              <p className="text-2xl font-bold text-primary">
                {simulation.percentual_mrr ? `${simulation.percentual_mrr.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Múltiplo Cap</p>
              <p className="text-2xl font-bold text-purple-500">
                {simulation.multiplo_cap ? `${simulation.multiplo_cap.toFixed(2)}x` : 'N/A'}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">MRR Atual:</span>
              <span className="font-semibold">{formatCurrency(mrrAtual)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prazo Estimado:</span>
              <Badge variant="outline" className="text-purple-500 border-purple-500/30">
                {cenarioBase ? `${cenarioBase.prazo_estimado_meses} meses` : 'N/A'}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primeira Parcela:</span>
              <span className="font-semibold">{simulation.primeira_parcela}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custo do Financiamento:</span>
              <span className="font-semibold text-yellow-500">
                {formatCurrency(simulation.custo_total)}
              </span>
            </div>
            
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Valor Total a Retornar:</span>
              <span className="font-bold">{simulation.valor_total_retorno ? formatCurrency(simulation.valor_total_retorno) : formatCurrency(simulation.valor_total || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RBF Explanation */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold mb-2">Como funciona o RBF</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Você paga um percentual fixo da sua receita mensal (MRR)</li>
                <li>• O pagamento se ajusta automaticamente ao seu faturamento</li>
                <li>• Não há juros compostos, apenas um múltiplo do valor investido</li>
                <li>• Meses com menor receita = parcelas menores</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="bg-yellow-500/5 border-yellow-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold mb-2">Importante</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Esta proposta será enviada para análise e publicada no marketplace</li>
                <li>• Investidores interessados farão ofertas com suas próprias condições</li>
                <li>• Você poderá aceitar a melhor oferta recebida</li>
                <li>• O processo de análise leva entre 24-48 horas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}