"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency, formatDate } from '@/lib/format';
import { ChevronLeft, Users, FileText, TrendingUp, Calendar, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Investidor {
  id: string;
  nome: string;
  email?: string;
  avatar?: string;
  valorInvestido: number;
  dataInvestimento: string;
  status: 'ativo' | 'pendente' | 'cancelado';
}

interface InvestimentoRaw {
  id: string;
  valor: number;
  dataInvestimento: string;
  status?: string;
  investidor?: {
    nome?: string;
    email?: string;
    avatar?: string;
  };
}

interface Contrato {
  id: string;
  empresa: {
    id: string;
    nome: string;
    email: string;
    setor?: string;
    website?: string;
  };
  proposta: {
    id: string;
    valorSolicitado: number;
    prazoMeses: number;
    taxaJuros: number;
    finalidade: string;
  };
  valorTotal: number;
  valorRecebido: number;
  statusContrato: string;
  dataInicio: string;
  dataVencimento: string;
  proximoPagamento: {
    valor: number;
    dataVencimento: string;
  };
  progresso: number;
  investimentos: Investidor[];
  pagamentos: Array<{
    valor: number;
    dataPagamento: string;
    status: string;
  }>;
  termos: {
    taxaPlataforma: number;
    multa: number;
    garantias?: string;
    clausulasEspeciais?: string[];
  };
}

interface MetricBoxProps {
  label: string;
  value: string;
  subtitle?: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

function MetricBox({ label, value, subtitle, bgColor, textColor, icon }: MetricBoxProps) {
  return (
    <div className={`${bgColor} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className={`text-2xl font-bold ${textColor}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

interface MetricDetailRowProps {
  label: string;
  value: string;
  tooltip?: string;
}

function MetricDetailRow({ label, value, tooltip }: MetricDetailRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border">
      <div className="flex items-center gap-2">
        <p className="text-sm">{label}</p>
        {tooltip && (
          <Info className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function InvestorCard({ investidor }: { investidor: Investidor }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={investidor.avatar} alt={investidor.nome} />
          <AvatarFallback>{investidor.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{investidor.nome}</h4>
            {getStatusBadge(investidor.status)}
          </div>
          <p className="text-sm text-muted-foreground">{investidor.email}</p>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm font-medium text-primary">
              {formatCurrency(investidor.valorInvestido)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(investidor.dataInvestimento)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ContratoDetalhesTomador() {
  const { id } = useParams();
  const router = useRouter();
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContrato = async () => {
      try {
        const response = await fetch(`/api/contratos/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar contrato');
        }
        const data = await response.json();
        
        // Transform API data to match our interface
        const contratoFormatted: Contrato = {
          id: data.id,
          empresa: data.empresa,
          proposta: data.proposta,
          valorTotal: data.valorTotal || data.proposta?.valorSolicitado || 0,
          valorRecebido: data.valorRecebido || 0,
          statusContrato: data.status || 'ativo',
          dataInicio: data.dataInicio || new Date().toISOString(),
          dataVencimento: data.dataVencimento || new Date(Date.now() + data.proposta?.prazoMeses * 30 * 24 * 60 * 60 * 1000).toISOString(),
          proximoPagamento: {
            valor: data.proximoPagamento?.valor || 0,
            dataVencimento: data.proximoPagamento?.dataVencimento || new Date().toISOString()
          },
          progresso: data.progresso || 0,
          investimentos: data.investimentos?.map((inv: InvestimentoRaw) => ({
            id: inv.id,
            nome: inv.investidor?.nome || 'Investidor',
            email: inv.investidor?.email,
            avatar: inv.investidor?.avatar,
            valorInvestido: inv.valor,
            dataInvestimento: inv.dataInvestimento,
            status: inv.status || 'ativo'
          })) || [],
          pagamentos: data.pagamentos || [],
          termos: {
            taxaPlataforma: data.taxaPlataforma || 0,
            multa: data.multa || 0,
            garantias: data.garantias,
            clausulasEspeciais: data.clausulasEspeciais
          }
        };
        
        setContrato(contratoFormatted);
      } catch (error) {
        console.error('Erro ao buscar contrato:', error);
        toast.error('Erro ao carregar os detalhes do contrato');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContrato();
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando detalhes do contrato...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!contrato) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl mx-auto">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contrato não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O contrato solicitado não foi encontrado ou você não tem permissão para visualizá-lo.
            </p>
            <Button onClick={() => router.push('/to/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalInvestidores = contrato.investimentos.length;
  const investidoresAtivos = contrato.investimentos.filter(i => i.status === 'ativo').length;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/to/dashboard')}
          className="mb-6 text-primary"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Voltar ao Dashboard
        </Button>

        {/* Progress Header */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-purple/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Contrato #{contrato.id.substring(0, 8)}
                </h1>
                <p className="text-muted-foreground">
                  {contrato.empresa.nome} - {formatDate(contrato.dataInicio)}
                </p>
              </div>
              <Badge variant={contrato.statusContrato === 'ativo' ? 'default' : 'secondary'}>
                {contrato.statusContrato.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso do Contrato</span>
                <span className="font-medium">{contrato.progresso}%</span>
              </div>
              <Progress value={contrato.progresso} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Início: {formatDate(contrato.dataInicio)}</span>
                <span>Vencimento: {formatDate(contrato.dataVencimento)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricBox
            label="Valor Total"
            value={formatCurrency(contrato.valorTotal)}
            bgColor="bg-primary/10"
            textColor="text-primary"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <MetricBox
            label="Valor Recebido"
            value={formatCurrency(contrato.valorRecebido)}
            bgColor="bg-success/10"
            textColor="text-success"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <MetricBox
            label="Próximo Pagamento"
            value={formatCurrency(contrato.proximoPagamento.valor)}
            subtitle={formatDate(contrato.proximoPagamento.dataVencimento)}
            bgColor="bg-warning/10"
            textColor="text-warning"
            icon={<Calendar className="w-4 h-4" />}
          />
          <MetricBox
            label="Taxa de Juros"
            value={`${contrato.proposta.taxaJuros}%`}
            subtitle="ao mês"
            bgColor="bg-info/10"
            textColor="text-info"
            icon={<Info className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Detalhes do Contrato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="termos">
                <AccordionItem value="termos">
                  <AccordionTrigger>Termos e Condições</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <MetricDetailRow
                        label="Prazo do Contrato"
                        value={`${contrato.proposta.prazoMeses} meses`}
                      />
                      <MetricDetailRow
                        label="Taxa da Plataforma"
                        value={`${contrato.termos.taxaPlataforma}%`}
                      />
                      <MetricDetailRow
                        label="Multa por Atraso"
                        value={`${contrato.termos.multa}%`}
                      />
                      <MetricDetailRow
                        label="Finalidade"
                        value={contrato.proposta.finalidade}
                      />
                      {contrato.termos.garantias && (
                        <MetricDetailRow
                          label="Garantias"
                          value={contrato.termos.garantias}
                        />
                      )}
                    </div>

                    {contrato.termos.clausulasEspeciais && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h5 className="font-medium mb-2">Cláusulas Especiais:</h5>
                        <ul className="text-sm space-y-1">
                          {contrato.termos.clausulasEspeciais.map((clausula, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{clausula}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="empresa">
                  <AccordionTrigger>Informações da Empresa</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <MetricDetailRow
                        label="Nome"
                        value={contrato.empresa.nome}
                      />
                      <MetricDetailRow
                        label="Email"
                        value={contrato.empresa.email}
                      />
                      {contrato.empresa.setor && (
                        <MetricDetailRow
                          label="Setor"
                          value={contrato.empresa.setor}
                        />
                      )}
                      {contrato.empresa.website && (
                        <MetricDetailRow
                          label="Website"
                          value={contrato.empresa.website}
                        />
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Investors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Investidores ({totalInvestidores})
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {investidoresAtivos} investidores ativos
              </div>
            </CardHeader>
            <CardContent>
              {contrato.investimentos.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {contrato.investimentos.map((investidor) => (
                    <InvestorCard key={investidor.id} investidor={investidor} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Ainda não há investidores neste contrato
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Risk Disclaimer */}
        <Card className="mt-6 border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">
                  Lembrete Importante sobre Riscos
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                  Este é um investimento P2P que envolve riscos de inadimplência. Os retornos não são garantidos pelo FGC. 
                  É fundamental cumprir com os pagamentos mensais conforme estabelecido no contrato para manter um bom 
                  relacionamento com os investidores e evitar penalidades.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}