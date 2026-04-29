import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Socio } from './socios.types';
import { SociosService } from './socios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-socios',
  imports: [CommonModule],
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios {
 socios: Socio[] = [];


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
          this.socios = response;
        },
        error: (error) => {
          console.error('Erro ao buscar sócios:', error);
        }
      }
    );
  }
}
