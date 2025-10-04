export interface Proposta {
  id: string;
  nome: string;
  emoji: string;
  score: number;
  scoreLabel: string;
  valor: number;
  rendimento: number;
  prazo: number;
  progressoFunding: number;
}

export interface PropostaDetalhada extends Proposta {
  website: string;
  setor: string;
  criacao: string;
  emprestimosQuitados: number;
  descricao: string;
  descricaoCompleta: string;
  metricas: {
    mrr: number;
    churn: number;
    runway: number;
    ltv: number;
    cac: number;
    numClientes: number;
    ticketMedio: number;
  };
  evolucaoARR: Array<{ mes: string; valor: number }>;
  evolucaoMRR: Array<{ mes: string; valor: number }>;
  evolucaoClientes: Array<{ mes: string; quantidade: number }>;
  contrato: {
    totalDivida: number;
    rendimento: number;
    duracao: number;
    progressoFunding: number;
    valorFinanciado: number;
  };
}

export const mockPropostas: Proposta[] = [
  {
    id: '1',
    nome: 'AgaaAI',
    emoji: '🤖',
    score: 87,
    scoreLabel: 'A1',
    valor: 500000,
    rendimento: 21,
    prazo: 18,
    progressoFunding: 52
  },
  {
    id: '2',
    nome: 'Homodeus AI',
    emoji: '🧠',
    score: 82,
    scoreLabel: 'A2',
    valor: 410000,
    rendimento: 19,
    prazo: 24,
    progressoFunding: 67
  },
  {
    id: '3',
    nome: 'TaskTracker',
    emoji: '📋',
    score: 78,
    scoreLabel: 'A2',
    valor: 300000,
    rendimento: 18,
    prazo: 20,
    progressoFunding: 45
  },
  {
    id: '4',
    nome: 'CloudSync',
    emoji: '☁️',
    score: 75,
    scoreLabel: 'A3',
    valor: 250000,
    rendimento: 17,
    prazo: 16,
    progressoFunding: 88
  },
  {
    id: '5',
    nome: 'DataFlow Pro',
    emoji: '📊',
    score: 85,
    scoreLabel: 'A1',
    valor: 450000,
    rendimento: 20,
    prazo: 22,
    progressoFunding: 34
  },
  {
    id: '6',
    nome: 'SecureVault',
    emoji: '🔒',
    score: 80,
    scoreLabel: 'A2',
    valor: 380000,
    rendimento: 18.5,
    prazo: 19,
    progressoFunding: 72
  },
  {
    id: '7',
    nome: 'SmartDoc',
    emoji: '📄',
    score: 73,
    scoreLabel: 'A3',
    valor: 220000,
    rendimento: 16.5,
    prazo: 15,
    progressoFunding: 91
  },
  {
    id: '8',
    nome: 'CodeAssist',
    emoji: '💻',
    score: 88,
    scoreLabel: 'A1',
    valor: 520000,
    rendimento: 22,
    prazo: 20,
    progressoFunding: 28
  },
  {
    id: '9',
    nome: 'MeetingFlow',
    emoji: '🎯',
    score: 76,
    scoreLabel: 'A2',
    valor: 290000,
    rendimento: 17.5,
    prazo: 18,
    progressoFunding: 58
  },
];

export const mockPropostaDetalhada: PropostaDetalhada = {
  id: '1',
  nome: 'AgaaAI',
  emoji: '🤖',
  score: 87,
  scoreLabel: 'A1',
  website: 'https://agaa.ai',
  setor: 'IA Generativa para escritórios de advocacia',
  criacao: '2022-12-07',
  emprestimosQuitados: 20,
  valor: 500000,
  rendimento: 21,
  prazo: 18,
  progressoFunding: 52,
  descricao: 'Capital de Giro para investimento em campanhas de marketing e fortalecimento da comunidade. O dinheiro será direcionado para: Campanhas em LinkedIn, Criação de uma comunidade ativa com devs no discord, Contratação de desenvolvedores para escalar segurança de SaaS e infraestrutura.',
  descricaoCompleta: 'AgaaAI é uma plataforma de IA especializada em automação de processos jurídicos. Nossa solução utiliza modelos de linguagem avançados para análise de documentos, geração de petições e pesquisa jurisprudencial. Com mais de 150 escritórios ativos na plataforma, processamos milhares de documentos mensalmente, economizando mais de 40 horas de trabalho por escritório. Nossa tecnologia combina NLP especializado em português jurídico com integração aos principais sistemas de gestão de processos do mercado.',
  metricas: {
    mrr: 300000,
    churn: 10,
    runway: 6,
    ltv: 30000,
    cac: 1250,
    numClientes: 150,
    ticketMedio: 2000
  },
  evolucaoARR: [
    { mes: '2022', valor: 600000 },
    { mes: '2022.5', valor: 850000 },
    { mes: '2023', valor: 1800000 },
    { mes: '2023.5', valor: 2500000 },
    { mes: '2024', valor: 3600000 },
  ],
  evolucaoMRR: [
    { mes: 'Jan', valor: 280000 },
    { mes: 'Fev', valor: 285000 },
    { mes: 'Mar', valor: 295000 },
    { mes: 'Abr', valor: 300000 }
  ],
  evolucaoClientes: [
    { mes: 'Jan', quantidade: 140 },
    { mes: 'Fev', quantidade: 142 },
    { mes: 'Mar', quantidade: 148 },
    { mes: 'Abr', quantidade: 150 }
  ],
  contrato: {
    totalDivida: 500000,
    rendimento: 21,
    duracao: 18,
    progressoFunding: 52,
    valorFinanciado: 261587.89
  }
};

export function getPropostaById(id: string): PropostaDetalhada | undefined {
  if (id === '1') return mockPropostaDetalhada;
  
  const proposta = mockPropostas.find(p => p.id === id);
  if (!proposta) return undefined;
  
  return {
    ...proposta,
    website: `https://${proposta.nome.toLowerCase().replace(/\s/g, '')}.com`,
    setor: 'Produtividade e Cloud',
    criacao: '2023-01-15',
    emprestimosQuitados: Math.floor(Math.random() * 25) + 5,
    descricao: `Plataforma SaaS inovadora para ${proposta.nome}. Capital será usado para expansão de marketing e desenvolvimento de produto.`,
    descricaoCompleta: `${proposta.nome} é uma solução completa que revoluciona o mercado com tecnologia de ponta. Nossa plataforma atende centenas de clientes e cresce consistentemente.`,
    metricas: {
      mrr: Math.floor(proposta.valor * 0.6),
      churn: Math.random() * 15,
      runway: Math.floor(Math.random() * 10) + 3,
      ltv: Math.floor(proposta.valor * 0.06),
      cac: Math.floor(proposta.valor * 0.0025),
      numClientes: Math.floor(Math.random() * 200) + 50,
      ticketMedio: Math.floor(proposta.valor * 0.004)
    },
    evolucaoARR: [
      { mes: '2023', valor: proposta.valor * 0.3 },
      { mes: '2023.5', valor: proposta.valor * 0.5 },
      { mes: '2024', valor: proposta.valor * 0.8 },
    ],
    evolucaoMRR: [
      { mes: 'Jan', valor: proposta.valor * 0.55 },
      { mes: 'Fev', valor: proposta.valor * 0.57 },
      { mes: 'Mar', valor: proposta.valor * 0.59 },
      { mes: 'Abr', valor: proposta.valor * 0.6 }
    ],
    evolucaoClientes: [
      { mes: 'Jan', quantidade: Math.floor(Math.random() * 200) + 50 },
      { mes: 'Fev', quantidade: Math.floor(Math.random() * 200) + 50 },
      { mes: 'Mar', quantidade: Math.floor(Math.random() * 200) + 50 },
      { mes: 'Abr', quantidade: Math.floor(Math.random() * 200) + 50 }
    ],
    contrato: {
      totalDivida: proposta.valor,
      rendimento: proposta.rendimento,
      duracao: proposta.prazo,
      progressoFunding: proposta.progressoFunding,
      valorFinanciado: proposta.valor * (proposta.progressoFunding / 100)
    }
  };
}