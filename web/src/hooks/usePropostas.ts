import { useState, useEffect } from 'react'

export interface MarketplaceFilters {
  search?: string
  scoreMin?: number
  scoreMax?: number
  tier?: string
  valorSolicitadoMin?: number
  valorSolicitadoMax?: number
  progressoFundingMin?: number
  progressoFundingMax?: number
  segmento?: string
  setor?: string
  statusFunding?: string
}

export interface PropostaMarketplace {
  id: string
  nome: string
  emoji: string
  score: number
  scoreLabel: string
  valor: number
  valorSolicitado: number
  valorFinanciado: number
  rendimento: number
  prazo: number
  progressoFunding: number
  statusFunding: string
  scoreNaAbertura?: number
  empresa: {
    id: string
    razaoSocial: string
    nomeFantasia?: string
    segmento?: string
    setor?: string
  }
}

export interface PropostasResponse {
  data: PropostaMarketplace[]
  pagination: {
    limit: number
    offset: number
    total: number
    sortBy: string
    sortOrder: string
  }
}

export function usePropostas(filters: MarketplaceFilters = {}) {
  const [data, setData] = useState<PropostaMarketplace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPropostas = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query parameters
        const params = new URLSearchParams()

        if (filters.search) params.set('search', filters.search)
        if (filters.scoreMin) params.set('scoreMin', filters.scoreMin.toString())
        if (filters.scoreMax) params.set('scoreMax', filters.scoreMax.toString())
        if (filters.tier) params.set('tier', filters.tier)
        if (filters.valorSolicitadoMin) params.set('valorSolicitadoMin', filters.valorSolicitadoMin.toString())
        if (filters.valorSolicitadoMax) params.set('valorSolicitadoMax', filters.valorSolicitadoMax.toString())
        if (filters.progressoFundingMin) params.set('progressoFundingMin', filters.progressoFundingMin.toString())
        if (filters.progressoFundingMax) params.set('progressoFundingMax', filters.progressoFundingMax.toString())
        if (filters.segmento) params.set('segmento', filters.segmento)
        if (filters.setor) params.set('setor', filters.setor)
        if (filters.statusFunding) params.set('statusFunding', filters.statusFunding)

        const url = `/api/propostas/marketplace${params.toString() ? `?${params.toString()}` : ''}`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: PropostasResponse = await response.json()
        setData(result.data)
      } catch (err) {
        console.error('Error fetching propostas:', err)
        setError(err instanceof Error ? err.message : 'Error fetching propostas')
        setData([]) // Fallback to empty array
      } finally {
        setLoading(false)
      }
    }

    fetchPropostas()
  }, [filters])

  return {
    propostas: data,
    loading,
    error,
    refetch: () => {
      const fetchPropostas = async () => {
        try {
          setLoading(true)
          setError(null)

          const params = new URLSearchParams()

          if (filters.search) params.set('search', filters.search)
          if (filters.scoreMin) params.set('scoreMin', filters.scoreMin.toString())
          if (filters.scoreMax) params.set('scoreMax', filters.scoreMax.toString())
          if (filters.tier) params.set('tier', filters.tier)
          if (filters.valorSolicitadoMin) params.set('valorSolicitadoMin', filters.valorSolicitadoMin.toString())
          if (filters.valorSolicitadoMax) params.set('valorSolicitadoMax', filters.valorSolicitadoMax.toString())
          if (filters.progressoFundingMin) params.set('progressoFundingMin', filters.progressoFundingMin.toString())
          if (filters.progressoFundingMax) params.set('progressoFundingMax', filters.progressoFundingMax.toString())
          if (filters.segmento) params.set('segmento', filters.segmento)
          if (filters.setor) params.set('setor', filters.setor)
          if (filters.statusFunding) params.set('statusFunding', filters.statusFunding)

          const url = `/api/propostas/marketplace${params.toString() ? `?${params.toString()}` : ''}`

          const response = await fetch(url)

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result: PropostasResponse = await response.json()
          setData(result.data)
        } catch (err) {
          console.error('Error fetching propostas:', err)
          setError(err instanceof Error ? err.message : 'Error fetching propostas')
          setData([])
        } finally {
          setLoading(false)
        }
      }

      fetchPropostas()
    }
  }
}