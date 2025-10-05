
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Plus, Minus, TrendingUp, TrendingDown } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface WalletBalance {
  currentBalance: number
  availableForWithdrawal: number
}

interface WalletTransaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'RETURN' | 'PIX_DEPOSIT' | 'PIX_WITHDRAWAL'
  amount: number
  description: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  createdAt: string
  processedAt?: string
}

interface WalletData {
  balance: WalletBalance
  transactions: WalletTransaction[]
}

export default function MeuSaldoPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // This endpoint needs to be created
        const response = await fetch('/api/wallet/balance-and-transactions')
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados da carteira')
        }
        
        const data: WalletData = await response.json()
        setWalletData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [])

  const handleAddFunds = async () => {
    try {
      // This endpoint needs to be created for PIX deposit
      const response = await fetch('/api/wallet/pix-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 0, // This would come from a modal/form
        }),
      })
      
      if (response.ok) {
        // Refresh wallet data after successful deposit initiation
        window.location.reload()
      }
    } catch (err) {
      console.error('Erro ao adicionar fundos:', err)
    }
  }

  const handleWithdrawal = async () => {
    try {
      // This endpoint needs to be created for withdrawal
      const response = await fetch('/api/wallet/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 0, // This would come from a modal/form
        }),
      })
      
      if (response.ok) {
        // Refresh wallet data after successful withdrawal request
        window.location.reload()
      }
    } catch (err) {
      console.error('Erro ao solicitar saque:', err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  const getTransactionTypeLabel = (type: WalletTransaction['type']) => {
    const labels = {
      DEPOSIT: 'Depósito',
      WITHDRAWAL: 'Saque',
      INVESTMENT: 'Investimento',
      RETURN: 'Retorno',
      PIX_DEPOSIT: 'Depósito PIX',
      PIX_WITHDRAWAL: 'Saque PIX',
    }
    return labels[type] || type
  }

  const getTransactionIcon = (type: WalletTransaction['type']) => {
    const isPositive = ['DEPOSIT', 'RETURN', 'PIX_DEPOSIT'].includes(type)
    return isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getStatusBadge = (status: WalletTransaction['status']) => {
    const variants = {
      PENDING: 'secondary',
      COMPLETED: 'default',
      FAILED: 'destructive',
      CANCELLED: 'outline',
    } as const

    const labels = {
      PENDING: 'Pendente',
      COMPLETED: 'Concluído',
      FAILED: 'Falhou',
      CANCELLED: 'Cancelado',
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Carregando dados da carteira...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!walletData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Nenhum dado encontrado</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Saldo</h1>
          <p className="text-muted-foreground">
            Gerencie seus fundos e acompanhe suas transações
          </p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletData.balance.currentBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total em sua carteira
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponível para Saque</CardTitle>
            <Minus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletData.balance.availableForWithdrawal)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor disponível para retirada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleAddFunds} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Fundos via PIX
        </Button>
        <Button 
          variant="outline" 
          onClick={handleWithdrawal}
          disabled={walletData.balance.availableForWithdrawal <= 0}
          className="flex items-center gap-2"
        >
          <Minus className="h-4 w-4" />
          Solicitar Saque
        </Button>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            Acompanhe todas as movimentações em sua carteira
          </CardDescription>
        </CardHeader>
        <CardContent>
          {walletData.transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletData.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        {getTransactionTypeLabel(transaction.type)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <span className={
                        ['DEPOSIT', 'RETURN', 'PIX_DEPOSIT'].includes(transaction.type)
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }>
                        {['DEPOSIT', 'RETURN', 'PIX_DEPOSIT'].includes(transaction.type) ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(transaction.createdAt)}</div>
                        {transaction.processedAt && transaction.status === 'COMPLETED' && (
                          <div className="text-xs text-muted-foreground">
                            Processado: {formatDate(transaction.processedAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}