"use client";
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function ConfiguracoesTomador() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-muted-foreground mb-8">
            Gerencie suas preferências e configurações da conta
          </p>
          
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">
              Página em desenvolvimento
            </h3>
            <p className="text-muted-foreground">
              Esta funcionalidade estará disponível em breve
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}