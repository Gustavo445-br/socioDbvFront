import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CriacaoSocioDTO, Socio } from './socios.types';
import { SociosService } from './socios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-socios',
  imports: [CommonModule],
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios {
 socios = signal<Socio[]>([]);
novoSocio: CriacaoSocioDTO = {
  nome: '',
  email: '',
  telefone: ''
};

 constructor(private readonly sociosService: SociosService) {

 }

 ngOnInit() {
    this.buscarTodosOsSocios();
  }

  buscarTodosOsSocios() {
    this.sociosService.buscarTodosOsSocios().subscribe(
      {
        next: (response: Socio[]) => {
          console.log('Sócios recebidos:', response);
          this.socios.set(response);
        },
        error: (error) => {
          console.error('Erro ao buscar sócios:', error);
        }
      }
    );
  }
  criarSocio() {
    this.sociosService.criarSocio(this.novoSocio).subscribe(
      {
        next: (response: Socio) => {
          console.log('Sócio criado:', response);
          this.socios.update((socios) => [...socios, response]);
          this.novoSocio = { ...this.novoSocio, nome: '', email: '', telefone: '' };
        },
        error: (error) => {
          console.error('Erro ao criar sócio:', error);
        }
      }
    )
  }
}
