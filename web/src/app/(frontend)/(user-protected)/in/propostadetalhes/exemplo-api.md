# Como Testar a API de Propostas

## 1. Criar dados de exemplo via API

### Primeiro, crie um Tomador:

```http
POST /api/tomadores
Content-Type: application/json

{
  "uidUsuario": "usuario123",
  "nomeCompleto": "João Silva",
  "email": "joao@exemplo.com",
  "cargo": "CEO"
}
```

### Depois, crie uma Empresa:

```http
POST /api/empresas
Content-Type: application/json

{
  "tomadorId": "ID_DO_TOMADOR_CRIADO",
  "cnpj": "12345678000195",
  "razaoSocial": "TechCorp LTDA",
  "nomeFantasia": "TechCorp",
  "website": "https://techcorp.com",
  "segmento": "Tecnologia",
  "setor": "SaaS",
  "estagioInvestimento": "Series A",
  "descricaoCurta": "Plataforma de gestão empresarial",
  "descricaoCompleta": "Uma empresa focada em soluções de software para gestão empresarial, oferecendo ferramentas intuitivas para pequenas e médias empresas.",
  "produto": "Plataforma SaaS",
  "dataFundacao": "2020-01-15",
  "numeroFuncionarios": 50,
  "emoji": "🚀"
}
```

### Por fim, crie uma Proposta:

```http
POST /api/propostas
Content-Type: application/json

{
  "empresaId": "ID_DA_EMPRESA_CRIADA",
  "valorSolicitado": 500000.00,
  "multiploCap": 1.5,
  "percentualMrr": 15.0,
  "duracaoMeses": 18,
  "valorMinimoFunding": 100000.00,
  "planoUsoFundos": "Expansão da equipe de desenvolvimento e marketing digital",
  "statusFunding": "ATIVO",
  "valorFinanciado": 250000.00,
  "progressoFunding": 50.0,
  "scoreNaAbertura": 87
}
```

## 2. Acessar a página de detalhes

Após criar os dados, acesse:

```
http://localhost:3000/in/propostadetalhes?id=ID_DA_PROPOSTA_CRIADA
```

Ou use o parâmetro de rota se configurado:

```
http://localhost:3000/in/propostadetalhes/ID_DA_PROPOSTA_CRIADA
```

## 3. Verificar dados via GET

Para listar todas as propostas:

```http
GET /api/propostas
```

Para buscar uma proposta específica:

```http
GET /api/propostas/ID_DA_PROPOSTA
```

## 4. Estrutura dos dados retornados

A API retorna uma proposta com a seguinte estrutura:

```typescript
{
  "id": "uuid",
  "empresaId": "uuid",
  "valorSolicitado": 500000.00,
  "multiploCap": 1.5,
  "percentualMrr": 15.0,
  "duracaoMeses": 18,
  "valorMinimoFunding": 100000.00,
  "planoUsoFundos": "string",
  "statusFunding": "ATIVO",
  "valorFinanciado": 250000.00,
  "progressoFunding": 50.0,
  "dataAbertura": "2024-01-01T00:00:00Z",
  "scoreNaAbertura": 87,
  "criadoEm": "2024-01-01T00:00:00Z",
  "empresa": {
    "id": "uuid",
    "cnpj": "12345678000195",
    "razaoSocial": "TechCorp LTDA",
    "nomeFantasia": "TechCorp",
    "website": "https://techcorp.com",
    "segmento": "Tecnologia",
    "setor": "SaaS",
    "descricaoCurta": "Descrição breve",
    "descricaoCompleta": "Descrição detalhada",
    "numeroFuncionarios": 50,
    "emoji": "🚀",
    "tomador": {
      "nomeCompleto": "João Silva",
      "email": "joao@exemplo.com"
    }
  }
}
```

## 5. Funcionalidades implementadas

✅ **Fetch de dados via API**: A página agora busca dados reais da API `/api/propostas/{id}`

✅ **Estados de loading**: Exibe loader enquanto carrega os dados

✅ **Tratamento de erro**: Mostra mensagem de erro se a proposta não for encontrada

✅ **Campos adaptados**: Todos os campos foram adaptados para usar a estrutura real da API:

- Nome da empresa: `proposta.empresa.nomeFantasia || proposta.empresa.razaoSocial`
- Emoji: `proposta.empresa.emoji || '🏢'`
- Website: `proposta.empresa.website`
- Score: `proposta.scoreNaAbertura`
- Informações da empresa: CNPJ, razão social, segmento, setor, etc.
- Detalhes da proposta: valor solicitado, múltiplo CAP, duração, etc.

✅ **Cálculos atualizados**:

- Rendimento baseado no múltiplo CAP: `(multiploCap - 1) * 100`
- Retorno total: `valorInvestimento * multiploCap`
- Progresso de funding: `(valorFinanciado / valorSolicitado) * 100`

## 6. Próximos passos

1. **Criar dados de teste**: Use as APIs para criar tomadores, empresas e propostas
2. **Testar a navegação**: Acesse a página de detalhes com um ID válido
3. **Verificar responsividade**: Teste em diferentes tamanhos de tela
4. **Adicionar métricas**: Integre com APIs de métricas quando disponíveis
