import { Component, ChangeDetectionStrategy, signal, HostListener } from '@angular/core';
import { CriacaoBeneficioDTO, Beneficio } from './beneficios.types';
import { BeneficiosService } from './beneficios.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-beneficios',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './beneficios.html',
  styleUrl: './beneficios.css',
})
export class Beneficios {
  beneficios = signal<Beneficio[]>([]);
  mostrarFormulario = signal(false);
  modoEdicao = signal(false);
  beneficioEditando = signal<Beneficio | null>(null);
  menuAberto = signal<number | null>(null);
  formularioBeneficio: FormGroup;

  constructor(
    private readonly beneficiosService: BeneficiosService,
    private readonly fb: FormBuilder
  ) {
    this.formularioBeneficio = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.buscarTodosOsBeneficios();
  }

  buscarTodosOsBeneficios() {
    this.beneficiosService.buscarTodosOsBeneficios().subscribe(
      {
        next: (response: Beneficio[]) => {
          console.log('Benefícios recebidos:', response);
          this.beneficios.set(response);
        },
        error: (error) => {
          console.error('Erro ao buscar benefícios:', error);
        }
      }
    );
  }

  toggleFormulario() {
    this.modoEdicao.set(false);
    this.beneficioEditando.set(null);
    this.mostrarFormulario.set(!this.mostrarFormulario());
  }

  iniciarEdicao(beneficio: Beneficio) {
    this.modoEdicao.set(true);
    this.beneficioEditando.set(beneficio);
    this.formularioBeneficio.patchValue({
      nome: beneficio.nome,
      descricao: beneficio.descricao
    });
    this.mostrarFormulario.set(true);
    this.fecharMenu();
  }

  criarBeneficio() {
    if (this.formularioBeneficio.valid) {
      const novoBeneficio: CriacaoBeneficioDTO = this.formularioBeneficio.value;

      if (this.modoEdicao() && this.beneficioEditando()) {
        this.atualizarBeneficio(this.beneficioEditando()!.id, novoBeneficio);
      } else {
        this.beneficiosService.criarBeneficio(novoBeneficio).subscribe(
          {
            next: (response: Beneficio) => {
              console.log('Benefício criado:', response);
              this.beneficios.update((beneficios) => [...beneficios, response]);
              this.formularioBeneficio.reset({ ativo: true });
              this.mostrarFormulario.set(false);
            },
            error: (error) => {
              console.error('Erro ao criar benefício:', error);
            }
          }
        );
      }
    } else {
      this.formularioBeneficio.markAllAsTouched();
    }
  }

  atualizarBeneficio(id: number, beneficio: CriacaoBeneficioDTO) {
    this.beneficiosService.atualizarBeneficio(id, beneficio).subscribe(
      {
        next: (response: Beneficio) => {
          console.log('Benefício atualizado:', response);
          this.beneficios.update((beneficios) =>
            beneficios.map(b => b.id === id ? response : b)
          );
          this.formularioBeneficio.reset({ ativo: true });
          this.mostrarFormulario.set(false);
          this.modoEdicao.set(false);
          this.beneficioEditando.set(null);
        },
        error: (error) => {
          console.error('Erro ao atualizar benefício:', error);
        }
      }
    );
  }

  cancelarCriacao() {
    this.formularioBeneficio.reset();
    this.mostrarFormulario.set(false);
    this.modoEdicao.set(false);
    this.beneficioEditando.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    // Fecha o menu se o clique não foi no botão do menu ou no dropdown
    if (!target.closest('.menu-container')) {
      this.fecharMenu();
    }
  }

  toggleMenu(beneficioId: number, event: Event) {
    event.stopPropagation(); // Impede que o evento se propague para o document
    this.menuAberto.set(this.menuAberto() === beneficioId ? null : beneficioId);
  }

  fecharMenu() {
    this.menuAberto.set(null);
  }

  deletarBeneficio(beneficio: Beneficio) {
    if (confirm(`Tem certeza que deseja deletar o benefício "${beneficio.nome}"?`)) {
      this.beneficiosService.deletarBeneficio(beneficio.id).subscribe(
        {
          next: () => {
            console.log('Benefício deletado:', beneficio.id);
            this.beneficios.update((beneficios) => beneficios.filter(b => b.id !== beneficio.id));
            this.fecharMenu();
          },
          error: (error) => {
            console.error('Erro ao deletar benefício:', error);
          }
        }
      );
    }
  }
}
