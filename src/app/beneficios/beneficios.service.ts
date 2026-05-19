import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CriacaoBeneficioDTO, Beneficio } from "./beneficios.types";

@Injectable({
    providedIn: 'root'
})
export class BeneficiosService {
    constructor(private readonly http: HttpClient) {}

    buscarTodosOsBeneficios():Observable<Beneficio[]> {
        return this.http.get<Beneficio[]>('http://localhost:3000/beneficios');
    }

    criarBeneficio(beneficio: CriacaoBeneficioDTO): Observable<Beneficio> {
        return this.http.post<Beneficio>('http://localhost:3000/beneficios', beneficio);
     }

    atualizarBeneficio(id: number, beneficio: CriacaoBeneficioDTO): Observable<Beneficio> {
        return this.http.patch<Beneficio>(`http://localhost:3000/beneficios/${id}`, beneficio);
    }

    deletarBeneficio(id: number): Observable<void> {
        return this.http.delete<void>(`http://localhost:3000/beneficios/${id}`);
    }
}