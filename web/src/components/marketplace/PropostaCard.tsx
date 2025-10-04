import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Proposta } from '@/lib/mockData';
import { formatCurrency } from '@/lib/format';

interface PropostaCardProps {
  proposta: Proposta;
  onClick: () => void;
}

export function PropostaCard({ proposta, onClick }: PropostaCardProps) {
  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score >= 85) return 'default';
    if (score >= 75) return 'secondary';
    return 'outline';
  };

  const getScoreBadgeClass = (score: number): string => {
    if (score >= 85) return 'bg-success text-success-foreground';
    if (score >= 75) return 'bg-warning text-warning-foreground';
    if (score >= 65) return 'bg-info text-info-foreground';
    return '';
  };

  return (
    <Card 
      className="hover:shadow-xl transition-all duration-200 cursor-pointer border-2 hover:border-primary"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{proposta.emoji}</span>
            <div>
              <CardTitle className="text-lg mb-1">{proposta.nome}</CardTitle>
              <Badge 
                variant={getScoreBadgeVariant(proposta.score)}
                className={getScoreBadgeClass(proposta.score)}
              >
                {proposta.scoreLabel}
              </Badge>
            </div>
          </div>
          <Badge variant="outline" className="text-lg font-bold border-2">
            {proposta.score}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Valor</p>
            <p className="font-semibold text-primary">
              {formatCurrency(proposta.valor)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Rendimento</p>
            <p className="font-semibold text-purple">
              {proposta.rendimento}%
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Prazo estimado</p>
          <p className="font-semibold">{proposta.prazo} meses</p>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso do Funding</span>
            <span className="font-semibold text-primary">
              {proposta.progressoFunding}%
            </span>
          </div>
          <Progress 
            value={proposta.progressoFunding} 
            className="h-2"
          />
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          className="w-full"
        >
          Ver Detalhes →
        </Button>
      </CardFooter>
    </Card>
  );
}