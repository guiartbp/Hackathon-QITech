"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Loader2, Search, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { tomadorOnboardingStorage, buscarCNPJ } from '@/lib/tomadorOnboardingStorage';
import { validarCNPJ } from '@/lib/validators';
import { mascaraCNPJ } from '@/lib/masks';

interface Step2Data {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  website: string;
  segmento: string;
  estagio_investimento: string;
  descricao_curta: string;
  produto: string;
  data_fundacao: string;
  numero_funcionarios: number;
  emoji?: string;
}

export default function DadosEmpresa() {
  const router = useRouter();
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [website, setWebsite] = useState('');
  const [segmento, setSegmento] = useState('');
  const [estagioInvestimento, setEstagioInvestimento] = useState('');
  const [descricaoCurta, setDescricaoCurta] = useState('');
  const [produto, setProduto] = useState('');
  const [dataFundacao, setDataFundacao] = useState('');
  const [numeroFuncionarios, setNumeroFuncionarios] = useState<number>(1);
  const [emoji, setEmoji] = useState('');
  const [buscandoCNPJ, setBuscandoCNPJ] = useState(false);
  const [cnpjBuscado, setCnpjBuscado] = useState(false);

  // Proteção de rota
  useEffect(() => {
    if (!tomadorOnboardingStorage.validateStepAccess(2)) {
      router.push('/cadastro/to/dados-pessoais');
      return;
    }

    // Carregar dados salvos
    const saved = tomadorOnboardingStorage.getStep(2) as Step2Data;
    if (saved) {
      setCnpj(saved.cnpj);
      setRazaoSocial(saved.razao_social);
      setNomeFantasia(saved.nome_fantasia);
      setWebsite(saved.website);
      setSegmento(saved.segmento);
      setEstagioInvestimento(saved.estagio_investimento);
      setDescricaoCurta(saved.descricao_curta);
      setProduto(saved.produto);
      setDataFundacao(saved.data_fundacao);
      setNumeroFuncionarios(saved.numero_funcionarios);
      setEmoji(saved.emoji || '');
      setCnpjBuscado(true);
    }
  }, [router]);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = mascaraCNPJ(e.target.value);
    setCnpj(masked);
    setCnpjBuscado(false);
    // Limpar campos auto-fill quando CNPJ muda
    if (!masked) {
      setRazaoSocial('');
      setDataFundacao('');
    }
  };

  const handleBuscarCNPJ = async () => {
    if (!validarCNPJ(cnpj)) {
      toast.error('CNPJ inválido');
      return;
    }

    setBuscandoCNPJ(true);
    try {
      const dados = await buscarCNPJ(cnpj);
      if (dados) {
        setRazaoSocial(dados.razaoSocial);
        setNomeFantasia(dados.nomeFantasia);
        setDataFundacao(dados.dataFundacao);
        setCnpjBuscado(true);
        toast.success('Dados encontrados na Receita Federal!');
      } else {
        toast.error('CNPJ não encontrado');
      }
    } catch (error) {
      toast.error('Erro ao buscar CNPJ. Tente novamente.');
    } finally {
      setBuscandoCNPJ(false);
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Auto-adicionar https:// se não tiver protocolo
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      value = 'https://' + value;
    }
    setWebsite(value);
  };

  // Validações
  const cnpjValido = validarCNPJ(cnpj);
  const razaoSocialValida = razaoSocial.length >= 3;
  const nomeFantasiaValido = nomeFantasia.length >= 2;
  const websiteValido = website.startsWith('https://') && website.length > 8;
  const segmentoValido = segmento.length > 0;
  const estagioValido = estagioInvestimento.length > 0;
  const descricaoValida = descricaoCurta.length >= 50 && descricaoCurta.length <= 200;
  const produtoValido = produto.length >= 100 && produto.length <= 500;
  const dataValida = dataFundacao.length > 0;
  const funcionariosValido = numeroFuncionarios >= 1;

  const isValid = cnpjValido && razaoSocialValida && nomeFantasiaValido && 
                  websiteValido && segmentoValido && estagioValido && 
                  descricaoValida && produtoValido && dataValida && funcionariosValido;

  const handleContinuar = () => {
    if (!isValid) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    // Salvar dados
    const data: Step2Data = {
      cnpj,
      razao_social: razaoSocial.trim(),
      nome_fantasia: nomeFantasia.trim(),
      website: website.trim(),
      segmento,
      estagio_investimento: estagioInvestimento,
      descricao_curta: descricaoCurta.trim(),
      produto: produto.trim(),
      data_fundacao: dataFundacao,
      numero_funcionarios: numeroFuncionarios,
      emoji: emoji || undefined
    };
    tomadorOnboardingStorage.saveStep(2, data);

    toast.success('Dados da empresa salvos com sucesso!');

    // Navegar para próxima tela
    router.push('/cadastro/to/integracao-stripe');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <OnboardingProgress currentStep={2} totalSteps={5} />

        {/* Header outside the box */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Sobre sua empresa 🏢</h1>
          <p className="text-xl text-gray-400">
            Precisamos conhecer melhor seu SaaS
          </p>
        </div>

        {/* Content box */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 space-y-8">
            {/* Seção 1 - CNPJ Auto-fill */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Dados da Receita Federal
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-base font-semibold text-white">CNPJ *</Label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      id="cnpj"
                      type="text"
                      placeholder="12.345.678/0001-90"
                      value={cnpj}
                      onChange={handleCnpjChange}
                      className="pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    {cnpj && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {cnpjValido ? (
                          <Check className="w-4 h-4 text-orange-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!cnpjValido || buscandoCNPJ}
                    onClick={handleBuscarCNPJ}
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    {buscandoCNPJ ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Buscar
                  </Button>
                </div>
                {cnpj && !cnpjValido && (
                  <p className="text-xs text-red-400">CNPJ inválido</p>
                )}
              </div>

              {/* Campos auto-fill */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razao-social" className="text-base font-semibold text-white">Razão Social *</Label>
                  <Input
                    id="razao-social"
                    type="text"
                    placeholder="EMPRESA LTDA"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    readOnly={cnpjBuscado}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome-fantasia" className="text-base font-semibold text-white">Nome Fantasia *</Label>
                  <Input
                    id="nome-fantasia"
                    type="text"
                    placeholder="MinhaEmpresa"
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-fundacao" className="text-base font-semibold text-white">Data de Fundação *</Label>
                <Input
                  id="data-fundacao"
                  type="date"
                  value={dataFundacao}
                  onChange={(e) => setDataFundacao(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Seção 2 - Informações Básicas */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
              
              <div className="space-y-2">
                <Label htmlFor="website" className="text-base font-semibold text-white">Website *</Label>
                <div className="relative">
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://suaempresa.com"
                    value={website}
                    onChange={handleWebsiteChange}
                    className="pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  {website && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {websiteValido ? (
                        <Check className="w-4 h-4 text-orange-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {website && !websiteValido && (
                  <p className="text-xs text-red-400">
                    Deve começar com https://
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="segmento" className="text-base font-semibold text-white">Segmento *</Label>
                  <Select value={segmento} onValueChange={setSegmento}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="B2B SaaS">B2B SaaS</SelectItem>
                      <SelectItem value="B2C SaaS">B2C SaaS</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Fintech">Fintech</SelectItem>
                      <SelectItem value="Edtech">Edtech</SelectItem>
                      <SelectItem value="Healthtech">Healthtech</SelectItem>
                      <SelectItem value="Proptech">Proptech</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estagio" className="text-base font-semibold text-white">Estágio de Investimento *</Label>
                  <Select value={estagioInvestimento} onValueChange={setEstagioInvestimento}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione o estágio" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                      <SelectItem value="Seed">Seed</SelectItem>
                      <SelectItem value="Série A">Série A</SelectItem>
                      <SelectItem value="Série B">Série B</SelectItem>
                      <SelectItem value="Série C+">Série C+</SelectItem>
                      <SelectItem value="Bootstrapped">Bootstrapped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Seção 3 - Descrição */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Descrição</h3>
              
              <div className="space-y-2">
                <Label htmlFor="descricao-curta" className="text-base font-semibold text-white">
                  Descrição Curta * ({descricaoCurta.length}/200)
                </Label>
                <Textarea
                  id="descricao-curta"
                  placeholder="O que sua empresa faz em uma frase"
                  value={descricaoCurta}
                  onChange={(e) => setDescricaoCurta(e.target.value.slice(0, 200))}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  rows={2}
                />
                {descricaoCurta && (descricaoCurta.length < 50 || descricaoCurta.length > 200) && (
                  <p className="text-xs text-red-400">
                    Entre 50 e 200 caracteres
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="produto" className="text-base font-semibold text-white">
                  Produto/Serviço Principal * ({produto.length}/500)
                </Label>
                <Textarea
                  id="produto"
                  placeholder="Descreva detalhadamente seu produto ou serviço principal"
                  value={produto}
                  onChange={(e) => setProduto(e.target.value.slice(0, 500))}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  rows={4}
                />
                {produto && (produto.length < 100 || produto.length > 500) && (
                  <p className="text-xs text-red-400">
                    Entre 100 e 500 caracteres
                  </p>
                )}
              </div>
            </div>

            {/* Seção 4 - Dados Adicionais */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Dados Adicionais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="funcionarios" className="text-base font-semibold text-white">Número de Funcionários *</Label>
                  <Input
                    id="funcionarios"
                    type="number"
                    min="1"
                    value={numeroFuncionarios}
                    onChange={(e) => setNumeroFuncionarios(parseInt(e.target.value) || 1)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emoji" className="text-base font-semibold text-white">Emoji da Empresa (opcional)</Label>
                  <Input
                    id="emoji"
                    type="text"
                    placeholder="🚀"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400">
                    Um emoji que representa sua empresa
                  </p>
                </div>
              </div>
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