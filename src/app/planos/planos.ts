import { Component, ChangeDetectionStrategy, signal, HostListener } from '@angular/core';
import { CriacaoPlanoDTO, Plano } from './planos.types';
import { PlanosService } from './planos.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeneficiosService } from '../beneficios/beneficios.service';
import { Beneficio } from '../beneficios/beneficios.types';

@Component({
  selector: 'app-planos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './planos.html',
  styleUrl: './planos.css',
})
export class Planos {
  planos = signal<Plano[]>([]);
  mostrarFormulario = signal(false);
  modoEdicao = signal(false);
  planoEditando = signal<Plano | null>(null);
  menuAberto = signal<number | null>(null);
  mostrarModalBeneficios = signal(false);
  planoSelecionado = signal<Plano | null>(null);
  beneficios = signal<Beneficio[]>([]);
  pesquisaBeneficio = signal('');
  mostrarConfirmacao = signal(false);
  mensagemConfirmacao = signal('')
  acaoConfirmacao: (() => void) | null = null;
  formularioPlano: FormGroup;

  constructor(
    private readonly planosService: PlanosService,
    private readonly fb: FormBuilder,
    private readonly beneficiosService: BeneficiosService,
  ) {
    this.formularioPlano = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      valor: [0, [Validators.required, Validators.min(0)]],
      descricao: ['']
    });

    // Buscar planos na inicialização
    this.buscarTodosOsPlanos();
  }

  buscarTodosOsPlanos() {
    this.planosService.buscarTodosOsPlanos().subscribe(
      {
        next: (response: Plano[]) => {
          this.planos.set(response);
        },
        error: (error) => {
          console.error('Erro ao buscar planos:', error);
        }
      }
    );
  }

  beneficioJaAdicionado(beneficioId: number): boolean {

    return this.planoSelecionado()?.beneficios?.some(
      beneficio => beneficio.id === beneficioId
    ) ?? false;

  }

  buscarPlano() {

    this.planosService
      .buscarPlanoPorId(1)
      .subscribe({

        next: (plano) => {
          console.log(plano);
        },

        error: (error) => {
          console.error(error);
        }
      });
  }

  buscarTodosOsBeneficios() {
    this.beneficiosService.buscarTodosOsBeneficios().subscribe({
      next: (response) => {
        this.beneficios.set(response);
      },

      error: (error) => {
        console.error('Erro ao buscar benefícios:', error);
      }
    });
  }

  abrirModalBeneficios(plano: Plano) {

    this.planosService
      .buscarPlanoPorId(plano.id)
      .subscribe({

        next: (planoCompleto) => {

          this.planoSelecionado.set(planoCompleto);

          this.buscarTodosOsBeneficios();

          this.mostrarModalBeneficios.set(true);

          this.fecharMenu();

          console.log(planoCompleto);
        },

        error: (error) => {
          console.error('Erro ao buscar plano:', error);
        }
      });
  }

  fecharModalBeneficios() {
    this.mostrarModalBeneficios.set(false);
    this.planoSelecionado.set(null);
  }

  beneficiosFiltrados() {

    const pesquisa = this.pesquisaBeneficio().toLowerCase();

    return this.beneficios().filter(beneficio =>
      beneficio.nome.toLowerCase().includes(pesquisa)
    );
  }

  toggleFormulario() {
    this.modoEdicao.set(false);
    this.planoEditando.set(null);
    this.mostrarFormulario.set(!this.mostrarFormulario());
  }

  iniciarEdicao(plano: Plano) {
    this.modoEdicao.set(true);
    this.planoEditando.set(plano);
    this.formularioPlano.patchValue({
      nome: plano.nome,
      valor: plano.valor
    });
    this.mostrarFormulario.set(true);
    this.fecharMenu();
  }

  criarPlano() {
    if (this.formularioPlano.valid) {
      const novoPlano: CriacaoPlanoDTO = this.formularioPlano.value;

      if (this.modoEdicao() && this.planoEditando()) {
        this.atualizarPlano(this.planoEditando()!.id, novoPlano);
      } else {
        this.planosService.criarPlano(novoPlano).subscribe(
          {
            next: (response: Plano) => {
              this.planos.update((planos) => [...planos, response]);
              this.formularioPlano.reset();
              this.mostrarFormulario.set(false);
            },
            error: (error) => {
              console.error('Erro ao criar plano:', error);
            }
          }
        );
      }
    } else {
      this.formularioPlano.markAllAsTouched();
    }
  }

  atualizarPlano(id: number, plano: CriacaoPlanoDTO) {
    this.planosService.atualizarPlano(id, plano).subscribe(
      {
        next: (response: Plano) => {
          console.log('Plano atualizado:', response);
          this.planos.update((planos) =>
            planos.map(p => p.id === id ? response : p)
          );
          this.formularioPlano.reset();
          this.mostrarFormulario.set(false);
          this.modoEdicao.set(false);
          this.planoEditando.set(null);
        },
        error: (error) => {
          console.error('Erro ao atualizar plano:', error);
        }
      }
    );
  }

  cancelarCriacao() {
    this.formularioPlano.reset();
    this.mostrarFormulario.set(false);
    this.modoEdicao.set(false);
    this.planoEditando.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    // Fecha o menu se o clique não foi no botão do menu ou no dropdown
    if (!target.closest('.menu-container')) {
      this.fecharMenu();
    }
  }

  toggleMenu(planoId: number, event: Event) {
    event.stopPropagation(); // Impede que o evento se propague para o document
    this.menuAberto.set(this.menuAberto() === planoId ? null : planoId);
  }

  fecharMenu() {
    this.menuAberto.set(null);
  }

  deletarPlano(plano: Plano) {

    this.abrirConfirmacao(
      `Deseja apagar o plano "${plano.nome}" mesmo?`,
      () => {

        this.planosService
          .deletarPlano(plano.id)
          .subscribe({

            next: () => {

              this.planos.update(planos =>
                planos.filter(p => p.id !== plano.id)
              );

              this.fecharMenu();
            },

            error: (error) => {
              console.error('Erro ao deletar plano:', error);
            }
          });
      }
    );
  }
  adicionarBeneficioAoPlano(planoId: number, beneficioId: number) {

    this.planosService
      .adicionarBeneficioAoPlano(planoId, beneficioId)
      .subscribe({

        next: () => {

          console.log('Benefício adicionado!');

          this.buscarTodosOsPlanos();

          this.fecharModalBeneficios();
        },

        error: (error) => {
          console.error('Erro ao adicionar benefício:', error);
        }
      });
  }
  abrirConfirmacao(
    mensagem: string,
    acao: () => void
  ) {

    this.mensagemConfirmacao.set(mensagem);

    this.acaoConfirmacao = acao;

    this.mostrarConfirmacao.set(true);
  }

  confirmarAcao() {

    if (this.acaoConfirmacao) {
      this.acaoConfirmacao();
    }

    this.fecharConfirmacao();
  }

  fecharConfirmacao() {

    this.mostrarConfirmacao.set(false);

    this.mensagemConfirmacao.set('');

    this.acaoConfirmacao = null;
  }
  removerBeneficioDoPlano(
    planoId: number,
    beneficioId: number
  ) {

    this.planosService
      .removerBeneficioDoPlano(planoId, beneficioId)
      .subscribe({

        next: () => {

          this.planos.update(planos =>
            planos.map(plano => {

              if (plano.id !== planoId) {
                return plano;
              }

              return {
                ...plano,
                beneficios: plano.beneficios?.filter(
                  beneficio => beneficio.id !== beneficioId
                )
              };
            })
          );

          if (this.planoSelecionado()?.id === planoId) {

            this.planoSelecionado.update(plano => {

              if (!plano) return null;

              return {
                ...plano,
                beneficios: plano.beneficios?.filter(
                  beneficio => beneficio.id !== beneficioId
                )
              };
            });
          }
        },

        error: (error) => {
          console.error('Erro ao remover benefício:', error);
        }
      });
  }
}
