"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo à will.lending</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ 0,00</p>
              <p className="text-sm text-muted-foreground">Valor investido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retorno</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">+0%</p>
              <p className="text-sm text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Na sua carteira</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Próximos passos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Complete seu cadastro e faça seu primeiro investimento para começar.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}