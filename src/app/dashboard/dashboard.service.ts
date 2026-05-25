import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardResumo,
  ReceitaMensal,
  SociosPorPlano,
  PagamentoRecente,
  SocioRecente
} from './dashboard.types';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly baseUrl = 'http://localhost:3000/dashboard';

  constructor(private readonly http: HttpClient) {}

  buscarResumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(`${this.baseUrl}/resumo`);
  }

  buscarReceitaMensal(): Observable<ReceitaMensal[]> {
    return this.http.get<ReceitaMensal[]>(`${this.baseUrl}/receita-mensal`);
  }

  buscarSociosPorPlano(): Observable<SociosPorPlano[]> {
    return this.http.get<SociosPorPlano[]>(`${this.baseUrl}/socios-por-plano`);
  }

  buscarPagamentosRecentes(): Observable<PagamentoRecente[]> {
    return this.http.get<PagamentoRecente[]>(`${this.baseUrl}/pagamentos-recentes`);
  }

  buscarSociosRecentes(): Observable<SocioRecente[]> {
    return this.http.get<SocioRecente[]>(`${this.baseUrl}/socios-recentes`);
  }

}
