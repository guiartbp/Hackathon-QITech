interface TomadorOnboardingData {
  step1?: {
    nome_completo: string;
    email: string;
    cargo: string;
    telefone: string;
    documento_identificacao: string; // CPF
  };
  step2?: {
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
  };
  step3?: {
    stripe_connected: boolean;
    stripe_account_id?: string;
    access_token?: string;
    skipped?: boolean;
    connected_at?: string;
  };
  step4?: {
    facial_verification: boolean;
    image: string;
    confidence: number;
    verified_at: string;
  };
}

const STORAGE_KEY = 'will_lending_tomador_onboarding';

export const tomadorOnboardingStorage = {
  saveStep: (step: number, data: unknown): void => {
    if (typeof window !== 'undefined') {
      const current = tomadorOnboardingStorage.getAllSteps();
      (current as Record<string, unknown>)[`step${step}`] = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  },
  
  getStep: (step: number): unknown => {
    if (typeof window !== 'undefined') {
      const data = tomadorOnboardingStorage.getAllSteps();
      return (data as Record<string, unknown>)[`step${step}`] || null;
    }
    return null;
  },
  
  getAllSteps: (): TomadorOnboardingData => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    }
    return {};
  },
  
  validateStepAccess: (targetStep: number): boolean => {
    if (targetStep === 1) return true;
    
    const data = tomadorOnboardingStorage.getAllSteps();
    for (let i = 1; i < targetStep; i++) {
      if (!(data as Record<string, unknown>)[`step${i}`]) return false;
    }
    return true;
  },
  
  clearAll: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  getProgress: (): { completedSteps: number; totalSteps: number; percentage: number } => {
    let completedSteps = 0;
    const totalSteps = 5; // Tomadores têm 5 steps
    
    for (let i = 1; i <= totalSteps; i++) {
      if (tomadorOnboardingStorage.getStep(i)) {
        completedSteps++;
      }
    }
    
    return {
      completedSteps,
      totalSteps,
      percentage: Math.round((completedSteps / totalSteps) * 100)
    };
  }
};

// Validador de email corporativo
export function validarEmailCorporativo(email: string): boolean {
  const dominiosPublicos = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 
    'icloud.com', 'live.com', 'msn.com', 'aol.com', 'terra.com.br',
    'uol.com.br', 'bol.com.br', 'ig.com.br'
  ];
  
  if (!email || !email.includes('@')) return false;
  
  const dominio = email.split('@')[1]?.toLowerCase();
  return !dominiosPublicos.includes(dominio);
}

// Mock da API da Receita Federal para busca de CNPJ
export async function buscarCNPJ(cnpj: string): Promise<{
  razaoSocial: string;
  nomeFantasia: string;
  dataFundacao: string;
  atividade: string;
} | null> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock de dados baseado no CNPJ
  const mockData = {
    '11.222.333/0001-81': {
      razaoSocial: 'TECH STARTUP LTDA',
      nomeFantasia: 'TechStart',
      dataFundacao: '2020-03-15',
      atividade: 'Desenvolvimento de software'
    },
    '22.333.444/0001-92': {
      razaoSocial: 'INOVACAO DIGITAL EIRELI',
      nomeFantasia: 'Inovação Digital',
      dataFundacao: '2019-08-22',
      atividade: 'Consultoria em tecnologia'
    }
  };
  
  return mockData[cnpj as keyof typeof mockData] || {
    razaoSocial: 'EMPRESA MOCK LTDA',
    nomeFantasia: 'Empresa Mock',
    dataFundacao: '2021-01-01',
    atividade: 'Atividade empresarial'
  };
}