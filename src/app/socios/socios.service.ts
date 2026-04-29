import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Socio } from "./socios.types";

@Injectable({
    providedIn: 'root'
})
export class SociosService {
    constructor(private readonly http: HttpClient) {}

    buscarTodosOsSocios():Observable<Socio[]> {
        return this.http.get<Socio[]>('http://localhost:3000/socios');
    }
}