// import type { Role } from '@/generated/prisma';

export type AllowedRoutes = { 
  GET?: string[]
  POST?: string[]
  PATCH?: string[]
  DELETE?: string[]
}

// Wallet and Transaction Types
export interface WalletBalance {
  currentBalance: number
  availableForWithdrawal: number
  blockedAmount?: number
}

export interface WalletTransaction {
  id: string
  userId: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'RETURN' | 'PIX_DEPOSIT' | 'PIX_WITHDRAWAL'
  amount: number
  description: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  reference?: string // PIX transaction ID or external reference
  createdAt: string
  processedAt?: string
  metadata?: Record<string, unknown> // Additional transaction data
}

export interface WalletData {
  balance: WalletBalance
  transactions: WalletTransaction[]
}

export interface PixDepositRequest {
  amount: number
  description?: string
}

export interface WithdrawalRequest {
  amount: number
  bankAccountId: string
  description?: string
}

export interface WalletApiResponse {
  success: boolean
  data?: WalletData
  error?: string
}