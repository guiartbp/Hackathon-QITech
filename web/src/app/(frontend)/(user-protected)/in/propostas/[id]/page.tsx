"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PropostaDetalhada {
  id: string
  nome: string
  emoji: string
  score: number
  scoreLabel: string
  valor: number
  valorSolicitado: number
  valorFinanciado: number
  rendimento: number
  prazo: number
  progressoFunding: number
  statusFunding: string
  scoreNaAbertura?: number
  empresa: {
    id: string
    razaoSocial: string
    nomeFantasia?: string
    segmento?: string
    setor?: string
    website?: string
    descricaoCurta?: string
    descricaoCompleta?: string
    numeroFuncionarios?: number
    dataFundacao?: string
    emoji?: string
  }
}

export default function PropostaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();
  const [proposta, setProposta] = useState<PropostaDetalhada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposta = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/propostas/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform API data to expected format
        const transformedData: PropostaDetalhada = {
          id: data.id,
          nome: data.empresa.nomeFantasia || data.empresa.razaoSocial,
          emoji: data.empresa.emoji || '🏢',
          score: 0, // Will need to be fetched from score API
          scoreLabel: 'N/A',
          valor: Number(data.valorSolicitado),
          valorSolicitado: Number(data.valorSolicitado),
          valorFinanciado: Number(data.valorFinanciado),
          rendimento: Number(data.multiploCap) * 100 - 100,
          prazo: data.duracaoMeses,
          progressoFunding: Number(data.valorSolicitado) > 0
            ? (Number(data.valorFinanciado) / Number(data.valorSolicitado)) * 100
            : 0,
          statusFunding: data.statusFunding,
          scoreNaAbertura: data.scoreNaAbertura,
          empresa: {
            id: data.empresa.id,
            razaoSocial: data.empresa.razaoSocial,
            nomeFantasia: data.empresa.nomeFantasia,
            segmento: data.empresa.segmento,
            setor: data.empresa.setor,
            website: data.empresa.website,
            descricaoCurta: data.empresa.descricaoCurta,
            descricaoCompleta: data.empresa.descricaoCompleta,
            numeroFuncionarios: data.empresa.numeroFuncionarios,
            dataFundacao: data.empresa.dataFundacao,
            emoji: data.empresa.emoji
          }
        };

        setProposta(transformedData);
      } catch (err) {
        console.error('Error fetching proposta:', err);
        setError(err instanceof Error ? err.message : 'Error fetching proposta details');
      } finally {
        setLoading(false);
      }
    };

    fetchProposta();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Carregando detalhes...</h3>
            <p className="text-muted-foreground">
              Buscando informações da proposta
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !proposta) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">
              {error ? 'Erro ao carregar proposta' : 'Proposta não encontrada'}
            </h2>
            {error && (
              <p className="text-muted-foreground mb-4">{error}</p>
            )}
            <Button onClick={() => navigate.push('/in/marketplace')}>
              Voltar ao Marketplace
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getHealthBadge = (score: number) => {
    if (score >= 85) return 'bg-success text-success-foreground';
    if (score >= 75) return 'bg-warning text-warning-foreground';
    return 'bg-info text-info-foreground';
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate.push('/in/marketplace')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Card */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-5xl">{proposta.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl mb-2">{proposta.nome}</CardTitle>
                          {proposta.empresa.website && (
                            <a
                              href={proposta.empresa.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              {proposta.empresa.website}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <Badge variant="outline" className="text-lg border-2">
                          Score {proposta.scoreNaAbertura || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Description */}
                  {proposta.empresa.descricaoCurta && (
                    <Alert className="bg-info/10 border-info/20">
                      <AlertTitle className="font-semibold mb-2">Descrição:</AlertTitle>
                      <AlertDescription className="text-sm leading-relaxed">
                        {proposta.empresa.descricaoCurta}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  {/* Contract Terms */}
                  <div>
                    <h3 className="font-semibold mb-4">Termos do Contrato</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Valor Solicitado</p>
                          <p className="text-lg font-bold">{formatCurrency(proposta.valorSolicitado)}</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Rendimento</p>
                          <p className="text-lg font-bold text-purple-600">{proposta.rendimento.toFixed(1)}%</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Duração</p>
                          <p className="text-lg font-bold">{proposta.prazo} meses</p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Funding Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-muted-foreground">Progresso do Funding</span>
                      <span className="font-semibold text-primary text-lg">
                        {proposta.progressoFunding.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={proposta.progressoFunding}
                      className="h-3 mb-3"
                    />
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(proposta.valorFinanciado)}
                      </span>
                      <span className="text-muted-foreground">
                        / {formatCurrency(proposta.valorSolicitado)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Company Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      🏢 Sobre a Empresa
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={getHealthBadge(proposta.scoreNaAbertura || 0)}
                    >
                      {proposta.statusFunding}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    {proposta.empresa.setor && (
                      <div>
                        <p className="text-sm text-muted-foreground">Setor</p>
                        <p className="font-semibold">{proposta.empresa.setor}</p>
                      </div>
                    )}
                    {proposta.empresa.segmento && (
                      <div>
                        <p className="text-sm text-muted-foreground">Segmento</p>
                        <p className="font-semibold">{proposta.empresa.segmento}</p>
                      </div>
                    )}
                    {proposta.empresa.numeroFuncionarios && (
                      <div>
                        <p className="text-sm text-muted-foreground">Funcionários</p>
                        <p className="font-semibold">{proposta.empresa.numeroFuncionarios}</p>
                      </div>
                    )}
                    {proposta.empresa.dataFundacao && (
                      <div>
                        <p className="text-sm text-muted-foreground">Fundação</p>
                        <p className="font-semibold">
                          {new Date(proposta.empresa.dataFundacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Full Description */}
                  {proposta.empresa.descricaoCompleta && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-3">Descrição Completa</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {proposta.empresa.descricaoCompleta}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Investment Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-2 border-primary">
                <CardHeader className="text-center pb-4">
                  <CardTitle>Investir nesta Proposta</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ainda {formatCurrency(proposta.valorSolicitado - proposta.valorFinanciado)} disponível
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Investment CTA */}
                  <Alert className="bg-success/10 border-success/20">
                    <AlertTitle className="font-semibold mb-2">
                      📊 Potencial de Retorno
                    </AlertTitle>
                    <AlertDescription>
                      <div className="text-sm">
                        <p className="mb-2">
                          <strong>{proposta.rendimento.toFixed(1)}%</strong> de rendimento estimado
                        </p>
                        <p className="text-muted-foreground">
                          Em <strong>{proposta.prazo} meses</strong>
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    className="w-full text-lg py-6"
                    onClick={() => toast.success('Feature em desenvolvimento!')}
                  >
                    Investir Agora
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Ao investir, você concorda com os{' '}
                    <a href="/termos" className="underline hover:text-primary">
                      Termos de Investimento
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}