import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CriacaoSocioDTO, Socio } from "./socios.types";

@Injectable({
    providedIn: 'root'
})
export class SociosService {
    constructor(private readonly http: HttpClient) {}

    buscarTodosOsSocios():Observable<Socio[]> {
        return this.http.get<Socio[]>('http://localhost:3000/socios');
    }

    criarSocio(socio: CriacaoSocioDTO): Observable<Socio> {
        return this.http.post<Socio>('http://localhost:3000/socios', socio);
     }

    atualizarSocio(id: number, socio: CriacaoSocioDTO): Observable<Socio> {
        return this.http.patch<Socio>(`http://localhost:3000/socios/${id}`, socio);
    }

    deletarSocio(id: number): Observable<void> {
        return this.http.delete<void>(`http://localhost:3000/socios/${id}`);
    }
    
}