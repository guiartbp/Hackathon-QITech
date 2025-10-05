"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { TrendingUp, Shield, Rocket, Target, BarChart3, Lock, Brain, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo-will.png"
              alt="Will Logo"
              width={40}
              height={40}
              className="mr-3"
            />
            <span className="text-white font-bold text-xl">Will</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <button
              onClick={() => router.push('/login')}
              className="text-orange-500 hover:text-orange-400 font-medium transition-colors duration-200"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section - Black Background */}
      <section className="relative min-h-screen bg-black text-white overflow-hidden pt-20">
        <div className="grid lg:grid-cols-[3fr_2fr] min-h-screen">
          {/* Left side - Content */}
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <Image
                src="/logo-will.png"
                alt="Will Logo"
                width={150}
                height={150}
                className="mr-4"
              />
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
             <span className="text-orange-500">A faísca que une o Founder ao Investidor</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">
              Capital de crescimento não dilutivo para te levar à próxima fase. 
              O caminho seguro para investir em crescimento real, com risco reduzido.
            </p>
            
            {/* Single CTA */}
            <div className="flex justify-start">
              <Button 
                onClick={() => router.push('/cadastro')}
                size="lg"
                className="px-12 py-4 text-lg bg-orange-600 hover:bg-orange-700 text-white border-none rounded-full"
              >
                Quero entrar no ecossistema
              </Button>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/hero.png"
                alt="Will connecting founders and investors"
                width={1500}
                height={1500}
                className="object-contain max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Black Background */}
      <section className="bg-black text-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-orange-400">
            O Problema que Resolvemos
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For SaaS */}
            <div className="bg-gray-900 p-10 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <Rocket className="w-12 h-12 text-orange-500" />
                <h3 className="text-2xl font-bold">Para SaaS</h3>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                "Você construiu um produto incrível, tem receita recorrente previsível e está crescendo rápido. 
                Mas para escalar precisa de marketing, contratações e comunidade. O problema? Bancos não entendem 
                SaaS e o Venture Capital cobra caro em diluição."
              </p>
            </div>
            
            {/* For Investors */}
            <div className="bg-gray-900 p-10 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <Target className="w-12 h-12 text-orange-500" />
                <h3 className="text-2xl font-bold">Para Investidores</h3>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                "No outro lado, investidores em busca de ativos rentáveis sofrem com juros baixos em produtos 
                tradicionais e alta volatilidade em equity. O Venture Debt baseado em receita oferece retornos 
                elevados, atrelados à performance de empresas de software com contratos recorrentes."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Orange Background */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            A Solução Will
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold mb-12">
            O futuro do financiamento SaaS é baseado em receita.
          </h3>
          
          <p className="text-xl mb-16 max-w-4xl mx-auto leading-relaxed">
            O Will oferece contratos de dívida inteligentes: os pagamentos se ajustam ao crescimento da empresa.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <BarChart3 className="w-16 h-16 mx-auto mb-6 text-white" />
              <p className="text-lg">Em meses de alta, a dívida é quitada mais rápido.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <Shield className="w-16 h-16 mx-auto mb-6 text-white" />
              <p className="text-lg">Em meses de baixa, o caixa da startup é preservado.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <TrendingUp className="w-16 h-16 mx-auto mb-6 text-white" />
              <p className="text-lg">O investidor tem retorno com teto definido (ex: até 1.3x o capital).</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/20 backdrop-blur-sm p-10 rounded-2xl">
              <h4 className="text-2xl font-bold mb-4">Para SaaS</h4>
              <p className="text-lg">Capital rápido, flexível, sem diluição.</p>
            </div>
            <div className="bg-black/20 backdrop-blur-sm p-10 rounded-2xl">
              <h4 className="text-2xl font-bold mb-4">Para Investidores</h4>
              <p className="text-lg">Retorno previsível, risco monitorado em tempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section - Black Background */}
      <section className="bg-black text-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-orange-400">
            Como Funciona
          </h2>
          
          <div className="grid md:grid-cols-2 gap-16">
            {/* For Founders */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-orange-400">🔹 Para Founders:</h3>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Conecte seus dados</h4>
                    <p className="text-gray-300">(billing, contabilidade).</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Receba proposta de crédito</h4>
                    <p className="text-gray-300">baseada no seu MRR/ARR.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Pague conforme sua receita cresce</h4>
                    <p className="text-gray-300">Sem perder equity, sem burocracia de banco.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For Investors */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-orange-400">🔹 Para Investidores:</h3>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Cadastre-se e passe pela aprovação KYC</h4>
                    <p className="text-gray-300">Processo seguro e regulamentado.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Selecione operações SaaS disponíveis</h4>
                    <p className="text-gray-300">Análise completa de cada oportunidade.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Acompanhe e receba</h4>
                    <p className="text-gray-300">Pagamentos mensais indexados ao MRR, direto na sua conta.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RBF Explanation Section - Orange Background */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            O que é Revenue-Based Financing (RBF)?
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm p-12 rounded-2xl">
            <p className="text-xl leading-relaxed">
              "É um modelo de dívida onde a parcela é um percentual da sua receita mensal. 
              Diferente de equity (sem venda de participação) e diferente de empréstimos fixos 
              (sem parcelas engessadas). O contrato tem um múltiplo de retorno pré-definido: 
              quando ele é atingido, a dívida é encerrada."
            </p>
          </div>
        </div>
      </section>

      {/* Security & Technology Section - Black Background */}
      <section className="bg-black text-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-orange-400">
            Segurança e Tecnologia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <BarChart3 className="w-12 h-12 text-orange-500" />
                <h3 className="text-xl font-bold">Streaming de métricas</h3>
              </div>
              <p className="text-gray-300">Monitoramento via APIs de billing, usage e contabilidade.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <Brain className="w-12 h-12 text-orange-500" />
                <h3 className="text-xl font-bold">Machine Learning de risco</h3>
              </div>
              <p className="text-gray-300">Antecipamos sinais de churn antes que virem inadimplência.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <CheckCircle className="w-12 h-12 text-orange-500" />
                <h3 className="text-xl font-bold">Compliance regulatório</h3>
              </div>
              <p className="text-gray-300">Estrutura legal de mútuo auditável, com logging transacional (Postgres/ACID).</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <Lock className="w-12 h-12 text-orange-500" />
                <h3 className="text-xl font-bold">Risco transparente</h3>
              </div>
              <p className="text-gray-300">Os investidores acompanham ARR, churn e métricas em tempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section - Orange Background */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Público-Alvo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/10 backdrop-blur-sm p-12 rounded-2xl text-center">
              <Rocket className="w-20 h-20 mx-auto mb-8 text-white" />
              <h3 className="text-2xl font-bold mb-6">SaaS em Série A/B</h3>
              <p className="text-lg leading-relaxed">
                Startups com MRR validado, métricas sólidas, em busca de capital escalável e não dilutivo.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-12 rounded-2xl text-center">
              <Target className="w-20 h-20 mx-auto mb-8 text-white" />
              <h3 className="text-2xl font-bold mb-6">Investidores Qualificados</h3>
              <p className="text-lg leading-relaxed">
                Profissionais e family offices que buscam retorno acima da renda fixa, 
                mas com risco controlado por métricas operacionais de SaaS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Black Background */}
      <section className="bg-black text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orange-400">
            Conectamos o capital ao crescimento do SaaS.
          </h2>
          
          <p className="text-2xl mb-12 text-gray-300">
            Junte-se ao futuro do financiamento:
          </p>
          
          <div className="space-y-6 mb-12">
            <p className="text-xl flex items-center justify-center gap-3">
              🚀 Se você é Founder → escale sem vender equity.
            </p>
            <p className="text-xl flex items-center justify-center gap-3">
              💸 Se você é Investidor → acesse um novo ativo rentável, monitorado em tempo real.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => router.push('/founder')}
              size="lg"
              className="px-12 py-4 text-xl bg-orange-600 hover:bg-orange-700 text-white border-none"
            >
              Sou Founder de SaaS
            </Button>
            
            <Button 
              onClick={() => router.push('/investor')}
              variant="outline"
              size="lg" 
              className="px-12 py-4 text-xl border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
            >
              Sou Investidor
            </Button>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-16 text-gray-500">
            <p>© 2025 will.lending - O futuro do financiamento SaaS</p>
          </div>
        </div>
      </section>
    </div>
  );
}