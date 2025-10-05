"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Shield, TrendingUp } from 'lucide-react';

export default function CadastroHomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Header outside the box */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Bem-vindo ao futuro do investimento em SaaS 🚀
          </h1>
          <p className="text-xl text-muted-foreground">
            Invista em empresas SaaS selecionadas e ganhe com o crescimento delas
          </p>
        </div>

        {/* Content box - discrete with orange border */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-8">
          {/* Benefícios */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-card-foreground">Retornos entre 12-18% ao ano</p>
                <p className="text-sm text-muted-foreground">
                  Investimentos em empresas SaaS com crescimento comprovado
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-card-foreground">Diversificação automática</p>
                <p className="text-sm text-muted-foreground">
                  Seu capital é distribuído entre várias empresas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-card-foreground">Liquidez flexível</p>
                <p className="text-sm text-muted-foreground">
                  Receba seus retornos mensalmente conforme o crescimento das empresas
                </p>
              </div>
            </div>
          </div>

          {/* Tempo estimado */}
          <div className="bg-accent border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Tempo estimado: 5-8 minutos</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Processo 100% digital e seguro
            </p>
          </div>

          {/* Call to Action */}
          <Button 
            onClick={() => router.push('/cadastro/nome')}
            size="lg"
            className="w-full"
          >
            Começar Cadastro →
          </Button>

          {/* Link para login */}
          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <button 
              onClick={() => router.push('/login')}
              className="text-primary hover:underline"
            >
              Fazer login
            </button>
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}