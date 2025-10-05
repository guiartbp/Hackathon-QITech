import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

interface APIConnection {
  name: string;
  status: 'connected' | 'disconnected' | 'connecting';
  lastSync?: string;
  description: string;
  logo: string;
  connectUrl?: string;
}

interface APIConnectionCardProps {
  connection: APIConnection;
  onConnect: (connectionName: string) => void;
}

export function APIConnectionCard({ connection, onConnect }: APIConnectionCardProps) {
  const getStatusIcon = () => {
    switch (connection.status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'connecting':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (connection.status) {
      case 'connected':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Conectando...</Badge>;
      default:
        return <Badge variant="outline" className="border-red-500/20 text-red-500">Desconectado</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-2xl">{connection.logo}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{connection.name}</h3>
                {getStatusIcon()}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {connection.description}
              </p>
              {connection.lastSync && connection.status === 'connected' && (
                <p className="text-xs text-muted-foreground">
                  Última sincronização: {connection.lastSync}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            {getStatusBadge()}
            
            {connection.status !== 'connected' && (
              <Button
                size="sm"
                onClick={() => onConnect(connection.name)}
                disabled={connection.status === 'connecting'}
                className="gap-2"
              >
                {connection.status === 'connecting' ? (
                  'Conectando...'
                ) : (
                  <>
                    Conectar <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}