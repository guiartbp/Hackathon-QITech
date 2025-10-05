"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Mail, Clock, ArrowRight } from 'lucide-react';

export default function CadastroSucesso() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [strategy, setStrategy] = useState<'ia' | 'picking' | null>(null);

  useEffect(() => {
    const strategyParam = searchParams.get('strategy') as 'ia' | 'picking';
    setStrategy(strategyParam);
  }, [searchParams]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleGoToMarketplace = () => {
    // Para demo, vamos para login primeiro
    router.push('/login?redirect=marketplace');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Header outside the box */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
            <div className="text-6xl">🎉</div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Parabéns! Cadastro Concluído
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Sua conta foi criada com sucesso. Bem-vindo à will.lending!
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6 border-orange-500 bg-orange-500/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-orange-500" />
              <div>
                <CardTitle className="text-white">Cadastro Aprovado</CardTitle>
                <p className="text-sm text-orange-400">
                  Sua documentação foi validada automaticamente
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Status da Conta:</p>
                <Badge className="bg-orange-500 text-white">Ativa</Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Estratégia Escolhida:</p>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {strategy === 'ia' ? '🤖 Carteira IA' : '🎯 Credit Picking'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card className="mb-6 bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-orange-500" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-white">Verifique seu email</p>
                <p className="text-sm text-gray-400">
                  Enviamos suas credenciais de acesso. Verifique sua caixa de entrada e spam.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-white">Faça seu primeiro depósito</p>
                <p className="text-sm text-gray-400">
                  {strategy === 'ia' 
                    ? 'Mínimo de R$ 1.000 para começar com a Carteira IA'
                    : 'Mínimo de R$ 5.000 para fazer Credit Picking'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-white">
                  {strategy === 'ia' 
                    ? 'Acompanhe sua carteira automatizada'
                    : 'Explore o marketplace de empresas'
                  }
                </p>
                <p className="text-sm text-gray-400">
                  {strategy === 'ia' 
                    ? 'Nossa IA começará a trabalhar para você imediatamente'
                    : 'Analise empresas SaaS e monte sua estratégia'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Importantes */}
        <Card className="mb-8 bg-gray-900 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">Lembre-se:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Seus investimentos começam a gerar retornos no mês seguinte</li>
                  <li>• Você receberá relatórios mensais por email</li>
                  <li>• Nosso suporte está disponível para qualquer dúvida</li>
                  <li>• Mantenha seus dados sempre atualizados</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <Button 
            onClick={handleLogin}
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Fazer Login →
          </Button>
          
          {strategy === 'picking' && (
            <Button 
              onClick={handleGoToMarketplace}
              variant="outline"
              size="lg"
              className="w-full border-gray-600 text-white hover:bg-gray-800"
            >
              Ver Marketplace de Empresas
            </Button>
          )}
          
          <p className="text-center text-xs text-gray-400">
            Alguma dúvida? Entre em contato conosco pelo{' '}
            <a href="mailto:suporte@willlending.com" className="text-orange-500 hover:underline">
              suporte@willlending.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}