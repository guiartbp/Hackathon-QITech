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
  taxa_juros_mensal: number;
  taxa_juros_anual: number;
  prazo_meses: number;
  valor_parcela: number;
  valor_total: number;
  custo_total: number;
  primeira_parcela: string;
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

      {/* Payment Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Condições de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Parcela Mensal</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(simulation.valor_parcela)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-500/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Taxa Mensal</p>
              <p className="text-2xl font-bold text-purple-500">
                {simulation.taxa_juros_mensal.toFixed(2)}%
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prazo:</span>
              <span className="font-semibold">{simulation.prazo_meses} meses</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxa Anual:</span>
              <Badge variant="outline" className="text-purple-500 border-purple-500/30">
                {simulation.taxa_juros_anual.toFixed(2)}% a.a.
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primeira Parcela:</span>
              <span className="font-semibold">{simulation.primeira_parcela}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor dos Juros:</span>
              <span className="font-semibold text-yellow-500">
                {formatCurrency(simulation.custo_total)}
              </span>
            </div>
            
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Valor Total a Pagar:</span>
              <span className="font-bold">{formatCurrency(simulation.valor_total)}</span>
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