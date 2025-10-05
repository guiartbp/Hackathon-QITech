"use client";

import { useState } from 'react';
import CadastroForm from './CadastroForm';
import Image from 'next/image';

type UserType = 'investor' | 'founder';

export default function CadastroPage() {
  const [userType, setUserType] = useState<UserType>('investor');

  const isInvestor = userType === 'investor';

  const handleUserTypeChange = (newUserType: UserType) => {
    setUserType(newUserType);
  };

  const content = {
    investor: {
      title: "Potencialize seus retornos.",
      subtitle: "Comece a investir em crescimento real hoje",
      description: "Acesse um novo ativo rentável com risco controlado por métricas operacionais de SaaS",
      image: "/investor-image.png", // You'll need to add this image
      emoji: "📈"
    },
    founder: {
      title: "Escale seu SaaS",
      subtitle: "Capital não dilutivo para sua próxima fase",
      description: "Receba capital baseado em receita sem perder equity da sua empresa",
      image: "/founder-image.png", // You'll need to add this image
      emoji: "🚀"
    }
  };

  const currentContent = content[userType];

  return (
    <div className="min-h-screen">
      <div className="grid lg:grid-cols-[2fr_3fr] min-h-screen">
        {/* Left side - Form */}
        <div className={`relative flex flex-col items-center justify-center px-8 py-16 transition-colors duration-500 ${
          isInvestor ? 'bg-black' : 'bg-gradient-to-br from-orange-600 to-orange-700'
        }`}>
          {/* Black gradient overlay for Founder mode */}
          {!isInvestor && (
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          )}

          {/* Form */}
          <div className="relative z-10 w-full max-w-lg">
            <CadastroForm 
              isDarkBackground={true}
              onUserTypeChange={handleUserTypeChange}
            />
          </div>
        </div>
        
        {/* Right side - Content */}
        <div className={`relative flex items-center justify-center p-16 transition-colors duration-500 overflow-hidden ${
          isInvestor 
            ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' 
            : 'bg-black text-white'
        }`}>
          {/* Background Images */}
          <div className="absolute inset-0 z-0">
            <Image
              src={isInvestor ? "/login-investor.png" : "/login-founder.png"}
              alt={isInvestor ? "Investor background" : "Founder background"}
              fill
              className="object-cover opacity-70"
            />
          </div>
          
          {/* Black gradient overlay for Investor mode */}
          {isInvestor && (
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          )}
          
          <div className="relative z-10 text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              {currentContent.title}
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed max-w-md mx-auto">
              {currentContent.subtitle}
            </p>
            
            <p className={`text-lg max-w-md mx-auto leading-relaxed ${
              isInvestor ? 'text-orange-100' : 'text-gray-300'
            }`}>
              {currentContent.description}
            </p>

            {/* Mode-specific highlights */}
            <div className="space-y-3 text-left max-w-md mx-auto">
              {isInvestor ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-sm">Retornos de 12-18% ao ano</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-sm">Risco monitorado em tempo real</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-sm">Diversificação automática</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-sm">Capital rápido e flexível</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-sm">Sem diluição de equity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-sm">Pagamentos baseados em receita</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
