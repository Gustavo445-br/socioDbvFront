import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { PlanoSocio } from '../pagamentos/pagamentos.types';

@Injectable({
  providedIn: 'root'
})
export class PlanosSociosService {

  private apiUrl = 'http://localhost:3000/planos-socios';

  constructor(
    private readonly http: HttpClient
  ) { }

  criarPlanoSocio(dados: { idSocio: number, idPlano: number }): Observable<any> {

    return this.http.post(this.apiUrl, dados);

  }

  removerPlanoSocio(planoSocioId: number): Observable<void> {

    return this.http.patch<void>(
      `${this.apiUrl}/${planoSocioId}`, {}
    );

  }

  buscarPlanosSocios(): Observable<PlanoSocio[]> {

    return this.http.get<PlanoSocio[]>(this.apiUrl);
  }

}
