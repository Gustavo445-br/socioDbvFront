export interface Pagamento {

  id: number;

  valor: number;

  data: string;

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