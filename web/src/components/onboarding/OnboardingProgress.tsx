"use client";

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  showBack?: boolean;
}

export function OnboardingProgress({ 
  currentStep, 
  totalSteps, 
  showBack = true 
}: OnboardingProgressProps) {
  const router = useRouter();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      {showBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      )}
      
      <Progress value={progress} className="h-3 bg-gray-200" />
      <p className="text-xs text-gray-600 mt-2 text-center">
        Passo {currentStep} de {totalSteps}
      </p>
    </div>
  );
}