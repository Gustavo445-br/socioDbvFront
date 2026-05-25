import {
  Component,
  HostListener,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Pagamento,
  CriacaoPagamentoDTO,
  PlanoSocio
} from './pagamentos.types';

import { PagamentosService } from './pagamentos.service';
import { PlanosSociosService } from '../planos/planos-socios.service';

@Component({
  selector: 'app-pagamentos',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './pagamentos.html',
  styleUrl: './pagamentos.css',
})
export class Pagamentos implements OnInit {

  pagamentos = signal<Pagamento[]>([]);

  planosSocios = signal<PlanoSocio[]>([]);

  mostrarFormulario = signal(false);

  modoEdicao = signal(false);

  menuAberto = signal<number | null>(null);

  mostrarConfirmacao = signal(false);

  mensagemConfirmacao = signal('');

  acaoConfirmacao: (() => void) | null = null;

  pagamentoEditando = signal<Pagamento | null>(null);

  opcoesPlanosSocios = signal<{ id: number, descricao: string }[]>([]);

  formularioPagamento: FormGroup;

  constructor(
    private readonly pagamentosService: PagamentosService,
    private readonly planosSociosService: PlanosSociosService,
    private readonly fb: FormBuilder
  ) {

    this.formularioPagamento = this.fb.group({

      planoSocioId: [
        '',
        Validators.required
      ],

      valor: [
        '',
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      data: [
        '',
        Validators.required
      ],

      parcela: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      mes: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(12)
        ]
      ]

    });

  }

  ngOnInit() {

    this.buscarPagamentos();
    this.buscarPlanosSocios();

  }

  buscarPagamentos() {

    this.pagamentosService
      .buscarPagamentos()
      .subscribe({

        next: (response) => {
          console.log("arroiz de forno",response);

          this.pagamentos.set(response);

        },

        error: (error) => {

          console.error(error);

        }

      });

  }

  buscarPlanosSocios() {

    this.planosSociosService
      .buscarPlanosSocios()
      .subscribe({

        next: (response) => {

          this.planosSocios.set(response);

          this.opcoesPlanosSocios.set(
            response.map(p => ({
              id: p.id,
              descricao: `${p.socio?.nome} - ${p.plano.nome}`
            }))
          );

        },

        error: (error) => {

          console.error(error);

        }

      });

  }

  toggleFormulario() {

    this.mostrarFormulario.set(
      !this.mostrarFormulario()
    );

  }

  criarPagamento() {

    console.log(this.formularioPagamento.invalid);
    if (this.formularioPagamento.invalid) {
console.log("Formulário inválido:", this.formularioPagamento);
      this.formularioPagamento
        .markAllAsTouched();

      return;

    }

    const dados: CriacaoPagamentoDTO =
      this.formularioPagamento.value;

    if (
      this.modoEdicao() &&
      this.pagamentoEditando()
    ) {

      this.pagamentosService
        .atualizarPagamento(
          this.pagamentoEditando()!.id,
          dados
        )
        .subscribe({

          next: (response) => {

            this.pagamentos.update(
              pagamentos =>
                pagamentos.map(p =>
                  p.id === response.id
                    ? response
                    : p
                )
            );

            this.cancelarCriacao();

          },

          error: (error) => {

            console.error(error);

          }

        });

      return;

    }

    dados.planoSocioId = Number(dados.planoSocioId);
    dados.data = new Date(dados.data).toDateString();

    this.pagamentosService
      .criarPagamento(dados)
      .subscribe({

        next: (response) => {

          this.pagamentos.update(
            pagamentos => [
              ...pagamentos,
              response
            ]
          );

          this.cancelarCriacao();

        },

        error: (error) => {

          console.error(error);

        }

      });

  }

  iniciarEdicao(
    pagamento: Pagamento
  ) {

    this.modoEdicao.set(true);

    this.pagamentoEditando.set(
      pagamento
    );

    this.formularioPagamento.patchValue({

      planoSocioId:
        pagamento.planoSocioId,

      valor:
        pagamento.valor,

      data:
        pagamento.data
          ?.toString()
          ?.split('T')[0],

      parcela:
        pagamento.parcela,

      mes:
        pagamento.mes

    });

    this.mostrarFormulario.set(true);

  }

  cancelarCriacao() {

    this.formularioPagamento.reset();

    this.mostrarFormulario.set(false);

    this.modoEdicao.set(false);

    this.pagamentoEditando.set(null);

  }

  deletarPagamento(
    pagamento: Pagamento
  ) {

    this.abrirConfirmacao(
      `Deseja deletar o pagamento #${pagamento.id}?`,
      () => {

        this.pagamentosService
          .deletarPagamento(
            pagamento.id
          )
          .subscribe({

            next: () => {

              this.pagamentos.update(
                pagamentos =>
                  pagamentos.filter(
                    p =>
                      p.id !== pagamento.id
                  )
              );

              this.fecharConfirmacao();

            },

            error: (error) => {

              console.error(error);

            }

          });

      }
    );

  }

  toggleMenu(
    pagamentoId: number,
    event: Event
  ) {

    event.stopPropagation();

    this.menuAberto.set(

      this.menuAberto() === pagamentoId
        ? null
        : pagamentoId

    );

  }

  fecharMenu() {

    this.menuAberto.set(null);

  }

  @HostListener(
    'document:click',
    ['$event']
  )

  onDocumentClick(
    event: Event
  ) {

    const target =
      event.target as HTMLElement;

    if (
      !target.closest(
        '.menu-container'
      )
    ) {

      this.fecharMenu();

    }

  }

  abrirConfirmacao(
    mensagem: string,
    acao: () => void
  ) {

    this.mensagemConfirmacao
      .set(mensagem);

    this.acaoConfirmacao = acao;

    this.mostrarConfirmacao
      .set(true);

  }

  fecharConfirmacao() {

    this.mostrarConfirmacao
      .set(false);

    this.mensagemConfirmacao
      .set('');

    this.acaoConfirmacao = null;

  }

  confirmarAcao() {

    if (
      this.acaoConfirmacao
    ) {

      this.acaoConfirmacao();

    }

  }

}