import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface WizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}

function getStepLabel(step: number) {
  const labels = {
    1: 'Parametrização',
    2: 'Conectividade',
    3: 'Simulação',
    4: 'Confirmação'
  };
  return labels[step as keyof typeof labels];
}

export function WizardLayout({ currentStep, totalSteps, children }: WizardLayoutProps) {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-8">
        
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${i + 1 <= currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground">
                    {getStepLabel(i + 1)}
                  </span>
                </div>
                {i < totalSteps - 1 && (
                  <div 
                    className={`
                      flex-1 h-1 mx-2
                      ${i + 1 < currentStep ? 'bg-primary' : 'bg-muted'}
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
        
      </div>
    </DashboardLayout>
  );
}