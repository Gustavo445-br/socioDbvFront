export interface DashboardResumo {
  totalSocios: number;
  sociosAtivos: number;
  inadimplentes: number;
  receitaMes: number;
  receitaAnual: number;
  novosSociosMes: number;
  totalPlanos: number;
  totalBeneficios: number;
}

export interface ReceitaMensal {
  mes: string;
  mesNumero: number;
  ano: number;
  valor: number;
}

export interface SociosPorPlano {
  planoId: number;
  planoNome: string;
  quantidade: number;
  percentual: number;
  valorMensal: number;
}

export interface PagamentoRecente {
  id: number;
  socioNome: string;
  planoNome: string;
  valor: number;
  data: string;
  mes: number;
  parcela: number;
}

export interface SocioRecente {
  id: number;
  nome: string;
  email: string;
  codigoSocio: string;
  planoAtual: string | null;
  dataIngresso: string | null;
}
