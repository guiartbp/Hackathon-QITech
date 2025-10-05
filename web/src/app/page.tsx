"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, DollarSign, Users, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="w-full px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Plataforma P2P para Venture Debt
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            will.lending
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Invista em empresas SaaS selecionadas e ganhe com o crescimento delas. 
            Venture Debt democratizado para todos os investidores.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/cadastro')}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              Começar a Investir →
            </Button>
            
            <Button 
              onClick={() => router.push('/login')}
              variant="outline"
              size="lg" 
              className="px-8 py-3 text-lg"
            >
              Já tenho conta
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-16 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">12-18%</div>
            <p className="text-muted-foreground">Retorno anual esperado</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <p className="text-muted-foreground">Empresas SaaS avaliadas</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">R$ 1k</div>
            <p className="text-muted-foreground">Investimento mínimo</p>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mb-16 space-y-8">
          <div className="flex items-start gap-6 p-6">
            <TrendingUp className="w-16 h-16 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Venture Debt para SaaS</h3>
              <p className="text-lg text-muted-foreground">
                Empresas de software pagam uma porcentagem do MRR mensalmente. 
                Crescimento = mais retorno para você.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 p-6">
            <Shield className="w-16 h-16 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Diversificação Automática</h3>
              <p className="text-lg text-muted-foreground">
                Seu capital é distribuído entre várias empresas com diferentes 
                perfis de risco e crescimento.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 p-6">
            <DollarSign className="w-16 h-16 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Pagamentos Mensais</h3>
              <p className="text-lg text-muted-foreground">
                Receba retornos mensalmente conforme as empresas crescem. 
                Liquidez flexível baseada na performance.
              </p>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-16 text-foreground">Como Funciona</h2>
          
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
                1
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-3 text-foreground">Cadastre-se</h3>
                <p className="text-lg text-muted-foreground">
                  Processo 100% digital em menos de 5 minutos. 
                  Validação automática dos seus documentos.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 flex-row-reverse">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
                2
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-3 text-foreground">Invista</h3>
                <p className="text-lg text-muted-foreground">
                  Escolha entre Carteira IA (automática) ou Credit Picking (manual). 
                  Seu capital é distribuído entre empresas SaaS.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
                3
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-3 text-foreground">Receba</h3>
                <p className="text-lg text-muted-foreground">
                  Acompanhe o crescimento das empresas e receba seus retornos 
                  mensalmente. Transparência total.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-card border border-border rounded-lg text-center py-16 px-8">
          <Users className="w-20 h-20 mx-auto mb-8 text-primary" />
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Pronto para começar a investir no futuro?
          </h2>
          <p className="text-xl mb-10 text-muted-foreground max-w-2xl mx-auto">
            Junte-se aos investidores que já descobriram o Venture Debt para SaaS
          </p>
          <Button 
            onClick={() => router.push('/cadastro')}
            size="lg"
            className="px-12 py-4 text-lg"
          >
            Criar Conta Grátis →
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p>© 2025 will.lending - Venture Debt democratizado</p>
        </div>
      </div>
    </div>
  );
}