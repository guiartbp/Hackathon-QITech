"use client";

import CadastroForm from './CadastroForm';
import Image from 'next/image';

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="grid lg:grid-cols-[2fr_3fr] min-h-screen">
        {/* Left side - Form */}
        <div className="flex items-center justify-center px-8 py-16 bg-black">
          <div className="w-full max-w-lg">
            <CadastroForm />
          </div>
        </div>
        
        {/* Right side - Image placeholder */}
        <div className="flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-700 text-white p-16">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Crie sua conta W1
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed max-w-md mx-auto">
              Comece a transformar seu planejamento patrimonial hoje
            </p>
            <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center">
              <div className="text-6xl">🚀</div>
            </div>
            <p className="text-lg text-orange-100 max-w-md mx-auto">
              Sinta a sensação de <span className="text-cyan-300 font-semibold">transformar cada um dos seus objetivos em conquistas</span>
            </p>
          </div>
        </div>
      </div>
    </div>
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