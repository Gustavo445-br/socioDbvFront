export interface Pagamento {
  planoSocioId: any;

  id: number;

  valor: number;

  data: Date;

  parcela: number;

  mes: number;

  planoSocio: {

    id: number;

    socio: {
      id: number;
      nome: string;
    };

    plano: {
      id: number;
      nome: string;
    };

  };

}

export interface CriacaoPagamentoDTO {

  planoSocioId: number;

  valor: number;

  data: string;

  parcela: number;

  mes: number;

}

export interface PlanoSocio {

  id: number;

  dataInicio: string;

  dataFim: string | null;

  plano: {
    id: number;
    nome: string;
    valor: number;
  };

  socio: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    codigoSocio: string;
  };

}