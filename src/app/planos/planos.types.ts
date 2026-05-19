import { Beneficio } from '../beneficios/beneficios.types';

export interface Plano {
  id: number;
  nome: string;
  valor: number;

  beneficios?: Beneficio[];
}

export interface CriacaoPlanoDTO {
  nome: string;
  valor: number;
}