interface OnboardingData {
  step1?: {
    tipo_pessoa: 'PF' | 'PJ';
    nome_razao_social: string;
  };
  step2?: {
    telefone: string;
    email: string;
  };
  step3?: {
    documento_identificacao: string;
    nome_representante?: string;
  };
  step4?: {
    image: string;
    confidence: number;
  };
  step5?: {
    patrimonio_liquido: 'ate_300k' | '300k_1mi' | '1mi_5mi' | 'acima_5mi';
    experiencia_ativos_risco: string[];
    modelo_investimento: 'conservador' | 'moderado' | 'agressivo';
    declaracao_risco: boolean;
  };
  step6?: {
    termos_aceitos: boolean;
    consentimentos: {
      riscos_p2p: boolean;
      riscos_saas: boolean;
      variacao_retornos: boolean;
      ausencia_fgc: boolean;
      capacidade_financeira: boolean;
    };
  };
  step7?: {
    estrategia_investimento: 'ia' | 'picking';
  };
}

export const onboardingStorage = {
  saveStep: (step: number, data: unknown): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`onboarding_step${step}`, JSON.stringify(data));
    }
  },

  getStep: (step: number): unknown => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(`onboarding_step${step}`);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  getAllSteps: (): OnboardingData => {
    const data: OnboardingData = {};
    for (let i = 1; i <= 7; i++) {
      const stepData = onboardingStorage.getStep(i);
      if (stepData) {
        (data as Record<string, unknown>)[`step${i}`] = stepData;
      }
    }
    return data;
  },

  clearAll: (): void => {
    if (typeof window !== 'undefined') {
      for (let i = 1; i <= 7; i++) {
        localStorage.removeItem(`onboarding_step${i}`);
      }
    }
  },

  getProgress: (): { completedSteps: number; totalSteps: number; percentage: number } => {
    let completedSteps = 0;
    const totalSteps = 7;
    
    for (let i = 1; i <= totalSteps; i++) {
      if (onboardingStorage.getStep(i)) {
        completedSteps++;
      }
    }
    
    return {
      completedSteps,
      totalSteps,
      percentage: Math.round((completedSteps / totalSteps) * 100)
    };
  },

  validateStepAccess: (targetStep: number): boolean => {
    // Step 1 (and 0) can always be accessed
    if (targetStep <= 1) return true;
    
    // Check if all previous steps are completed
    for (let i = 1; i < targetStep; i++) {
      if (!onboardingStorage.getStep(i)) {
        return false;
      }
    }
    
    return true;
  }
};