import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CriacaoPlanoDTO, Plano } from "./planos.types";

@Injectable({
    providedIn: 'root'
})
export class PlanosService {
    constructor(private readonly http: HttpClient) { }

    buscarTodosOsPlanos(): Observable<Plano[]> {
        return this.http.get<Plano[]>('http://localhost:3000/planos');
    }

    criarPlano(plano: CriacaoPlanoDTO): Observable<Plano> {
        return this.http.post<Plano>('http://localhost:3000/planos', plano);
    }

    atualizarPlano(id: number, plano: CriacaoPlanoDTO): Observable<Plano> {
        return this.http.patch<Plano>(`http://localhost:3000/planos/${id}`, plano);
    }

    deletarPlano(id: number): Observable<void> {
        return this.http.delete<void>(`http://localhost:3000/planos/${id}`);
    }

    //':planoId/beneficios/:beneficioId'
    adicionarBeneficioAoPlano(planoId: number, beneficioId: number): Observable<void> {
        return this.http.post<void>(`http://localhost:3000/planos/${planoId}/beneficios/${beneficioId}`, {});
    }

    removerBeneficioDoPlano(planoId: number, beneficioId: number): Observable<void> {
        return this.http.delete<void>(`http://localhost:3000/planos/${planoId}/beneficios/${beneficioId}`);
    }

    buscarPlanoPorId(id: number): Observable<Plano> {
        return this.http.get<Plano>(
            `http://localhost:3000/planos/${id}`
        );
    }
}
