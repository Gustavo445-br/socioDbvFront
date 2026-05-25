import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  Pagamento,
  CriacaoPagamentoDTO
} from './pagamentos.types';

@Injectable({
  providedIn: 'root'
})
export class PagamentosService {

  private apiUrl =
    'http://localhost:3000/pagamentos';

  constructor(
    private readonly http: HttpClient
  ) {}

  buscarPagamentos():
    Observable<Pagamento[]> {

    return this.http.get<Pagamento[]>(
      this.apiUrl
    );

  }

  buscarPagamentoPorId(
    id: number
  ): Observable<Pagamento> {

    return this.http.get<Pagamento>(
      `${this.apiUrl}/${id}`
    );

  }

  criarPagamento(
    pagamento: CriacaoPagamentoDTO
  ): Observable<Pagamento> {

    return this.http.post<Pagamento>(
      this.apiUrl,
      pagamento
    );

  }

  atualizarPagamento(
    id: number,
    pagamento: CriacaoPagamentoDTO
  ): Observable<Pagamento> {

    return this.http.patch<Pagamento>(
      `${this.apiUrl}/${id}`,
      pagamento
    );

  }

  deletarPagamento(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}