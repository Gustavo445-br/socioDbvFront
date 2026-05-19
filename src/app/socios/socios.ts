import { Component, HostListener, signal } from '@angular/core';
import { CriacaoSocioDTO, Socio } from './socios.types';
import { SociosService } from './socios.service';
import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { PlanosSociosService } from '../planos/planos-socios.service';
import { Plano } from '../planos/planos.types';
import { PlanosService } from '../planos/planos.service';

@Component({
  selector: 'app-socios',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios {

  socios = signal<Socio[]>([]);
  planos = signal<Plano[]>([]);

  mostrarFormulario = signal(false);
  modoEdicao = signal(false);

  socioEditando = signal<Socio | null>(null);

  menuAberto = signal<number | null>(null);

  mostrarModalPlanos = signal(false);

  socioSelecionado = signal<Socio | null>(null);

  formularioSocio: FormGroup;

  selectPlano: any;

  // MODAL DE CONFIRMAÇÃO
  mostrarConfirmacao = signal(false);

  mensagemConfirmacao = signal('');

  acaoConfirmacao: (() => void) | null = null;

  constructor(
    private readonly sociosService: SociosService,
    private readonly fb: FormBuilder,
    private readonly planosSociosService: PlanosSociosService,
    private readonly planosService: PlanosService,
  ) {

    this.formularioSocio = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
        ]
      ]
    });

  }

  ngOnInit() {
    this.buscarTodosOsSocios();
  }

  buscarTodosOsSocios() {

    this.sociosService.buscarTodosOsSocios().subscribe({

      next: (response: Socio[]) => {

        console.log('Sócios recebidos:', response);

        this.socios.set(response);

      },

      error: (error) => {
        console.error('Erro ao buscar sócios:', error);
      }

    });

  }

  toggleFormulario() {

    this.modoEdicao.set(false);

    this.socioEditando.set(null);

    this.mostrarFormulario.set(!this.mostrarFormulario());

  }

  iniciarEdicao(socio: Socio) {

    this.modoEdicao.set(true);

    this.socioEditando.set(socio);

    this.formularioSocio.patchValue({
      nome: socio.nome,
      email: socio.email,
      telefone: socio.telefone
    });

    this.mostrarFormulario.set(true);

  }

  criarSocio() {

    if (this.formularioSocio.valid) {

      const novoSocio: CriacaoSocioDTO =
        this.formularioSocio.value;

      if (this.modoEdicao() && this.socioEditando()) {

        this.atualizarSocio(
          this.socioEditando()!.id,
          novoSocio
        );

      } else {

        this.sociosService.criarSocio(novoSocio).subscribe({

          next: (response: Socio) => {

            console.log('Sócio criado:', response);

            this.socios.update((socios) => [
              ...socios,
              response
            ]);

            this.formularioSocio.reset();

            this.mostrarFormulario.set(false);

          },

          error: (error) => {
            console.error('Erro ao criar sócio:', error);
          }

        });

      }

    } else {

      this.formularioSocio.markAllAsTouched();

    }

  }

  atualizarSocio(
    id: number,
    socio: CriacaoSocioDTO
  ) {

    this.sociosService.atualizarSocio(id, socio).subscribe({

      next: (response: Socio) => {

        console.log('Sócio atualizado:', response);

        this.socios.update((socios) =>
          socios.map(s =>
            s.id === id ? response : s
          )
        );

        this.formularioSocio.reset();

        this.mostrarFormulario.set(false);

        this.modoEdicao.set(false);

        this.socioEditando.set(null);

      },

      error: (error) => {
        console.error('Erro ao atualizar sócio:', error);
      }

    });

  }

  cancelarCriacao() {

    this.formularioSocio.reset();

    this.mostrarFormulario.set(false);

    this.modoEdicao.set(false);

    this.socioEditando.set(null);

  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {

    const target = event.target as HTMLElement;

    if (!target.closest('.menu-container')) {

      this.fecharMenu();

    }

  }

  toggleMenu(
    socioId: number,
    event: Event
  ) {

    event.stopPropagation();

    this.menuAberto.set(
      this.menuAberto() === socioId
        ? null
        : socioId
    );

  }

  fecharMenu() {

    this.menuAberto.set(null);

  }

  abrirModalPlanos(socio: Socio) {

    this.socioSelecionado.set(socio);

    this.planosService.buscarTodosOsPlanos().subscribe({

      next: (response: Plano[]) => {

        this.planos.set(response);

        this.mostrarModalPlanos.set(true);

      },

      error: (error) => {
        console.error(error);
      }

    });

  }

  fecharModalPlanos() {

    this.mostrarModalPlanos.set(false);

    this.socioSelecionado.set(null);

  }

  adicionarPlanoAoSocio(
    planoId: number,
    socioId: number
  ) {

    this.planosSociosService
      .criarPlanoSocio({

        idSocio: socioId,
        idPlano: planoId

      })

      .subscribe({

        next: () => {

          console.log(
            'Plano adicionado ao sócio'
          );

          this.buscarTodosOsSocios();

          this.fecharModalPlanos();

        },

        error: (error: any) => {
          console.error(error);
        }

      });

  }

  removerPlanoDoSocio(planoSocioId: number) {

    this.planosSociosService
      .removerPlanoSocio(planoSocioId)
      .subscribe({

        next: () => {

          console.log(
            'Plano removido do sócio'
          );

          // REMOVE VISUALMENTE SEM RECARREGAR
          this.socios.update((socios) =>

            socios.map((socio) => ({

              ...socio,

              planosSocios:
                socio.planosSocios?.filter(
                  (ps: any) =>
                    ps.id !== planoSocioId
                )

            }))

          );

          this.fecharConfirmacao();

        },

        error: (error) => {
          console.error(
            'Erro ao remover plano:',
            error
          );
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

  }

  fecharConfirmacao() {

    this.mostrarConfirmacao.set(false);

    this.mensagemConfirmacao.set('');

    this.acaoConfirmacao = null;

  }

  deletarSocio(socio: Socio) {

    this.abrirConfirmacao(

      `Deseja deletar o sócio "${socio.nome}"?`,

      () => {

        this.sociosService
          .deletarSocio(socio.id)
          .subscribe({

            next: () => {

              console.log(
                'Sócio deletado:',
                socio.id
              );

              this.socios.update((socios) =>
                socios.filter(
                  s => s.id !== socio.id
                )
              );

              this.fecharMenu();

              this.fecharConfirmacao();

            },

            error: (error) => {

              console.error(
                'Erro ao deletar sócio:',
                error
              );

            }

          });

      }

    );

  }

}