# Endpoints do Dashboard

**Base URL:** `http://localhost:3000/dashboard`

---

### `GET /dashboard/resumo`

Indicadores principais exibidos nos cards do topo.

**Resposta `200`**
```json
{
  "totalSocios": 120,
  "sociosAtivos": 98,
  "inadimplentes": 22,
  "receitaMes": 12450.00,
  "receitaAnual": 89300.00,
  "novosSociosMes": 7,
  "totalPlanos": 3,
  "totalBeneficios": 8
}
```

| Campo | Descrição |
|---|---|
| `totalSocios` | Total de sócios cadastrados |
| `sociosAtivos` | Sócios com matrícula ativa (`dataFim IS NULL`) |
| `inadimplentes` | Sócios ativos sem pagamento no mês corrente |
| `receitaMes` | Soma dos pagamentos do mês corrente |
| `receitaAnual` | Soma dos pagamentos do ano corrente |
| `novosSociosMes` | Sócios cuja primeira matrícula iniciou no mês corrente |
| `totalPlanos` | Total de planos cadastrados |
| `totalBeneficios` | Total de benefícios cadastrados |

---

### `GET /dashboard/receita-mensal`

Receita agregada dos últimos 6 meses para o gráfico de barras.

**Resposta `200`**
```json
[
  { "mes": "Dez", "mesNumero": 12, "ano": 2024, "valor": 8200.00 },
  { "mes": "Jan", "mesNumero": 1,  "ano": 2025, "valor": 9100.00 },
  { "mes": "Fev", "mesNumero": 2,  "ano": 2025, "valor": 8750.00 },
  { "mes": "Mar", "mesNumero": 3,  "ano": 2025, "valor": 10300.00 },
  { "mes": "Abr", "mesNumero": 4,  "ano": 2025, "valor": 11200.00 },
  { "mes": "Mai", "mesNumero": 5,  "ano": 2025, "valor": 12450.00 }
]
```

| Campo | Descrição |
|---|---|
| `mes` | Abreviação em português: `"Jan"`, `"Fev"`, … `"Dez"` |
| `mesNumero` | Número do mês (1–12) |
| `ano` | Ano |
| `valor` | Soma dos pagamentos daquele mês/ano |

> Ordenar por `ano` e `mesNumero` crescente. Meses sem pagamento devem vir com `valor: 0`.

---

### `GET /dashboard/socios-por-plano`

Distribuição de sócios ativos por plano para o gráfico de barras horizontais.

**Resposta `200`**
```json
[
  { "planoId": 1, "planoNome": "Plano Ouro",   "quantidade": 45, "percentual": 45.9, "valorMensal": 150.00 },
  { "planoId": 2, "planoNome": "Plano Prata",  "quantidade": 35, "percentual": 35.7, "valorMensal": 90.00  },
  { "planoId": 3, "planoNome": "Plano Bronze", "quantidade": 18, "percentual": 18.4, "valorMensal": 50.00  }
]
```

| Campo | Descrição |
|---|---|
| `planoId` | ID do plano |
| `planoNome` | Nome do plano |
| `quantidade` | Sócios com matrícula ativa neste plano |
| `percentual` | `(quantidade / totalSociosAtivos) * 100`, 1 casa decimal |
| `valorMensal` | Valor mensal do plano |

> Ordenar por `quantidade` decrescente. Incluir apenas planos com ao menos 1 sócio ativo.

---

### `GET /dashboard/pagamentos-recentes`

Os 5 pagamentos mais recentes para a tabela de atividade.

**Resposta `200`**
```json
[
  {
    "id": 42,
    "socioNome": "Maria Silva",
    "planoNome": "Plano Ouro",
    "valor": 150.00,
    "data": "2025-05-22T00:00:00.000Z",
    "mes": 5,
    "parcela": 5
  }
]
```

> Ordenar por `data` decrescente. Retornar no máximo 5 registros.

---

### `GET /dashboard/socios-recentes`

Os 5 sócios mais recentemente cadastrados para a tabela de atividade.

**Resposta `200`**
```json
[
  {
    "id": 120,
    "nome": "Ana Costa",
    "email": "ana.costa@email.com",
    "codigoSocio": "SOC-0120",
    "planoAtual": "Plano Ouro",
    "dataIngresso": "2025-05-18T00:00:00.000Z"
  },
  {
    "id": 119,
    "nome": "Carlos Melo",
    "email": "carlos.melo@email.com",
    "codigoSocio": "SOC-0119",
    "planoAtual": null,
    "dataIngresso": null
  }
]
```

| Campo | Descrição |
|---|---|
| `planoAtual` | Nome do plano da matrícula ativa mais recente, ou `null` |
| `dataIngresso` | `dataInicio` da matrícula ativa mais recente em ISO 8601, ou `null` |

> Ordenar por `id` decrescente. Retornar no máximo 5 registros.
