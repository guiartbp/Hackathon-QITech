"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { onboardingStorage } from '@/lib/onboardingStorage';
import { validarCPF, validarCNPJ } from '@/lib/validators';
import { mascaraCPF, mascaraCNPJ } from '@/lib/masks';

interface Step3Data {
  documento_identificacao: string;
  nome_representante?: string;
}

export default function CadastroDocumento() {
  const router = useRouter();
  const [documento, setDocumento] = useState('');
  const [nomeRepresentante, setNomeRepresentante] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>('PF');

  // Proteção de rota e carregamento de dados
  useEffect(() => {
    if (!onboardingStorage.validateStepAccess(3)) {
      router.push('/cadastro/nome');
      return;
    }

    // Buscar tipo de pessoa do step 1
    const step1 = onboardingStorage.getStep(1);
    if (step1) {
      setTipoPessoa(step1.tipo_pessoa);
    }

    // Carregar dados salvos
    const saved = onboardingStorage.getStep(3);
    if (saved) {
      setDocumento(saved.documento_identificacao);
      setNomeRepresentante(saved.nome_representante || '');
    }
  }, [router]);

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const masked = tipoPessoa === 'PF' ? mascaraCPF(value) : mascaraCNPJ(value);
    setDocumento(masked);
  };

  const documentoValido = tipoPessoa === 'PF' 
    ? validarCPF(documento) 
    : validarCNPJ(documento);

  const isValid = documentoValido && (tipoPessoa === 'PF' || nomeRepresentante.length >= 3);

  const handleContinuar = () => {
    if (!isValid) {
      toast.error('Verifique os dados inseridos');
      return;
    }

    // Salvar dados
    const data: Step3Data = {
      documento_identificacao: documento,
      ...(tipoPessoa === 'PJ' && { nome_representante: nomeRepresentante.trim() })
    };
    onboardingStorage.saveStep(3, data);

    toast.success('Documento validado com sucesso!');
    
    // Navegar
    router.push('/cadastro/provadevida');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <OnboardingProgress currentStep={3} totalSteps={7} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground text-white mb-3">
            Documento de identificação 📄
          </h1>
          <p className="text-xl text-muted-foreground">
            {tipoPessoa === 'PF' 
              ? 'Precisamos do seu CPF para prosseguir'
              : 'Precisamos do CNPJ da empresa'
            }
          </p>
        </div>

        {/* Content box */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-8">
            {/* Input Documento */}
            <div className="space-y-2">
                            <Label htmlFor="documento" className="text-base font-semibold text-card-foreground">
                {tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'} *
              </Label>
              <div className="relative">
                <Input
                  id="documento"
                  type="text"
                  placeholder={tipoPessoa === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                  value={documento}
                  onChange={handleDocumentoChange}
                  className="pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {documento && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {documentoValido ? (
                      <Check className="w-4 h-4 text-orange-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {documento && !documentoValido && (
                <p className="text-xs text-red-400">
                  Digite um {tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'} válido
                </p>
              )}
            </div>

            {/* Campo adicional para PJ */}
            {tipoPessoa === 'PJ' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Label htmlFor="representante" className="text-white">Nome do Representante Legal *</Label>
                <Input
                  id="representante"
                  type="text"
                  placeholder="Nome completo do responsável"
                  value={nomeRepresentante}
                  onChange={(e) => setNomeRepresentante(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {nomeRepresentante.length > 0 && nomeRepresentante.length < 3 && (
                  <p className="text-xs text-red-400">
                    Mínimo de 3 caracteres
                  </p>
                )}
              </div>
            )}

            {/* Informação sobre segurança */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
              <p className="text-sm text-orange-500">
                🔒 Utilizamos criptografia de ponta para proteger seus dados pessoais
              </p>
            </div>

            {/* Botão Continuar */}
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-700 disabled:text-gray-400"
              disabled={!isValid}
              onClick={handleContinuar}
            >
              {isValid ? 'Continuar →' : 'Preencha todos os campos corretamente'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}