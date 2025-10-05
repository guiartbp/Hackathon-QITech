"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FacialVerificationProps {
  mockMode?: boolean;
  onSuccess: (data: { image: string; confidence: number }) => void;
  onError: (error: string) => void;
}

export function FacialVerification({ 
  onSuccess, 
  onError 
}: FacialVerificationProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const mockValidation = async () => {
    setStatus('processing');
    setMessage('Processando imagem...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 95% sucesso, 5% falha
    if (Math.random() > 0.05) {
      setStatus('success');
      setMessage('Validação concluída com sucesso!');
      onSuccess({ image: 'mock_base64', confidence: 0.97 });
    } else {
      setStatus('error');
      setMessage('Não conseguimos validar. Tente novamente.');
      onError('Validation failed');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      mockValidation();
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="pt-6 space-y-4">
        {/* Camera Preview Mock */}
        <div className="aspect-[3/4] bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
          {status === 'idle' && (
            <div className="text-center text-gray-400">
              <Camera className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">Posicione seu rosto no centro</p>
            </div>
          )}
          
          {status === 'processing' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4" />
              <p className="text-sm text-gray-400">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center text-orange-500">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-2" />
              <p className="font-semibold">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center text-red-500">
              <AlertTriangle className="w-16 h-16 mx-auto mb-2" />
              <p className="font-semibold">{message}</p>
            </div>
          )}
        </div>

        {/* Dicas */}
        <Alert className="bg-gray-800 border-gray-600">
          <AlertDescription>
            <p className="font-medium mb-2 text-white">💡 Dicas:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Remova óculos e bonés</li>
              <li>Fique em local bem iluminado</li>
              <li>Olhe diretamente para a câmera</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Upload Button */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="upload-selfie"
        />
        <label htmlFor="upload-selfie">
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
            size="lg"
            disabled={status === 'processing'}
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {status === 'idle' ? 'Enviar Selfie' : 'Tentar Novamente'}
            </span>
          </Button>
        </label>
      </CardContent>
    </Card>
  );
}