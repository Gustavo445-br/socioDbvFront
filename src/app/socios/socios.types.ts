export interface Socio {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  codigoSocio: string;
}
export interface CriacaoSocioDTO {
  nome: string;
  telefone: string;
  email: string;
}