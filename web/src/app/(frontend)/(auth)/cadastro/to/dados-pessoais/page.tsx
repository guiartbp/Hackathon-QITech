"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { tomadorOnboardingStorage, validarEmailCorporativo } from '@/lib/tomadorOnboardingStorage';
import { validarCPF, validarEmail, validarTelefone } from '@/lib/validators';
import { mascaraCPF, mascaraTelefone } from '@/lib/masks';

interface Step1Data {
  nome_completo: string;
  email: string;
  cargo: string;
  telefone: string;
  documento_identificacao: string;
}

export default function DadosPessoais() {
  const router = useRouter();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');

  // Carregar dados salvos (se existirem)
  useEffect(() => {
    const saved = tomadorOnboardingStorage.getStep(1) as Step1Data;
    if (saved) {
      setNomeCompleto(saved.nome_completo);
      setEmail(saved.email);
      setCargo(saved.cargo);
      setTelefone(saved.telefone);
      setCpf(saved.documento_identificacao);
    }
  }, []);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = mascaraTelefone(e.target.value);
    setTelefone(masked);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = mascaraCPF(e.target.value);
    setCpf(masked);
  };

  // Validações
  const nomeValido = nomeCompleto.length >= 3;
  const emailValido = validarEmail(email) && validarEmailCorporativo(email);
  const cargoValido = cargo.length > 0;
  const telefoneValido = validarTelefone(telefone);
  const cpfValido = validarCPF(cpf);
  const isValid = nomeValido && emailValido && cargoValido && telefoneValido && cpfValido;

  const handleContinuar = () => {
    if (!isValid) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    // Salvar dados
    const data: Step1Data = {
      nome_completo: nomeCompleto.trim(),
      email: email.trim().toLowerCase(),
      cargo,
      telefone,
      documento_identificacao: cpf
    };
    tomadorOnboardingStorage.saveStep(1, data);

    toast.success('Dados pessoais salvos com sucesso!');

    // Navegar para próxima tela
    router.push('/cadastro/to/dados-empresa');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <OnboardingProgress currentStep={1} totalSteps={5} showBack={false} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Vamos começar! 👋</h1>
          <p className="text-xl text-gray-400">
            Nos conte sobre você, o representante da empresa
          </p>
        </div>

        {/* Content box */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-8">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-base font-semibold text-white">Nome Completo *</Label>
              <div className="relative">
                <Input
                  id="nome"
                  type="text"
                  placeholder="João Silva"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  className="pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {nomeCompleto && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {nomeValido ? (
                      <Check className="w-4 h-4 text-orange-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {nomeCompleto && !nomeValido && (
                <p className="text-xs text-red-400">
                  Mínimo de 3 caracteres
                </p>
              )}
            </div>

            {/* Email Corporativo */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-white">Email Corporativo *</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@suaempresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailValido ? (
                      <Check className="w-4 h-4 text-orange-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {email && !validarEmail(email) && (
                <p className="text-xs text-red-400">
                  Digite um email válido
                </p>
              )}
              {email && validarEmail(email) && !validarEmailCorporativo(email) && (
                <p className="text-xs text-red-400">
                  Use seu email corporativo (não Gmail, Hotmail, etc.)
                </p>
              )}
              <p className="text-xs text-orange-500">
                💡 Use seu email corporativo (@suaempresa.com)
              </p>
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <Label htmlFor="cargo" className="text-base font-semibold text-white">Cargo *</Label>
              <Select value={cargo} onValueChange={setCargo}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione seu cargo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="CTO">CTO</SelectItem>
                  <SelectItem value="CFO">CFO</SelectItem>
                  <SelectItem value="COO">COO</SelectItem>
                  <SelectItem value="Founder">Founder</SelectItem>
                  <SelectItem value="Co-founder">Co-founder</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-base font-semibold text-white">Telefone *</Label>
              <div className="relative">
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  className="pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {telefone && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {telefoneValido ? (
                      <Check className="w-4 h-4 text-orange-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {telefone && !telefoneValido && (
                <p className="text-xs text-red-400">
                  Digite um celular válido com 11 dígitos
                </p>
              )}
            </div>

            {/* CPF */}
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-base font-semibold text-white">CPF *</Label>
              <div className="relative">
                <Input
                  id="cpf"
                  type="text"
                  placeholder="123.456.789-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  className="pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {cpf && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {cpfValido ? (
                      <Check className="w-4 h-4 text-orange-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {cpf && cpf.length >= 14 && !cpfValido && (
                <p className="text-xs text-red-400">
                  CPF inválido
                </p>
              )}
            </div>

            {/* Card informativo */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <p className="text-sm text-orange-500">
                🔒 Seus dados estão seguros e criptografados
              </p>
            </div>

            {/* Botão Continuar */}
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-700 disabled:text-gray-400"
              disabled={!isValid}
              onClick={handleContinuar}
            >
              {isValid ? 'Continuar →' : 'Preencha todos os campos'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}