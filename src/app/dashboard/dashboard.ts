import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardService } from './dashboard.service';
import {
  DashboardResumo,
  ReceitaMensal,
  SociosPorPlano,
  PagamentoRecente,
  SocioRecente
} from './dashboard.types';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  resumo = signal<DashboardResumo | null>(null);
  receitaMensal = signal<ReceitaMensal[]>([]);
  sociosPorPlano = signal<SociosPorPlano[]>([]);
  pagamentosRecentes = signal<PagamentoRecente[]>([]);
  sociosRecentes = signal<SocioRecente[]>([]);

  carregandoResumo = signal(true);
  carregandoReceita = signal(true);
  carregandoPlanos = signal(true);
  carregandoPagamentos = signal(true);
  carregandoSocios = signal(true);

  erroResumo = signal(false);
  erroReceita = signal(false);
  erroPlanos = signal(false);
  erroPagamentos = signal(false);
  erroSocios = signal(false);

  dataAtualizacao = signal(new Date());

  maxReceita = computed(() => {
    const valores = this.receitaMensal().map(r => r.valor);
    if (valores.length === 0) return 1;
    return Math.max(...valores) || 1;
  });

  taxaAtividade = computed(() => {
    const r = this.resumo();
    if (!r || r.totalSocios === 0) return 0;
    return Math.round((r.sociosAtivos / r.totalSocios) * 100);
  });

  constructor(
    private readonly dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.carregarTodos();
  }

  carregarTodos() {
    this.dataAtualizacao.set(new Date());
    this.carregarResumo();
    this.carregarReceitaMensal();
    this.carregarSociosPorPlano();
    this.carregarPagamentosRecentes();
    this.carregarSociosRecentes();
  }

  carregarResumo() {
    this.carregandoResumo.set(true);
    this.erroResumo.set(false);
    this.dashboardService.buscarResumo().subscribe({
      next: (data) => {
        this.resumo.set(data);
        this.carregandoResumo.set(false);
      },
      error: () => {
        this.erroResumo.set(true);
        this.carregandoResumo.set(false);
      }
    });
  }

  carregarReceitaMensal() {
    this.carregandoReceita.set(true);
    this.erroReceita.set(false);
    this.dashboardService.buscarReceitaMensal().subscribe({
      next: (data) => {
        this.receitaMensal.set(data);
        this.carregandoReceita.set(false);
      },
      error: () => {
        this.erroReceita.set(true);
        this.carregandoReceita.set(false);
      }
    });
  }

  carregarSociosPorPlano() {
    this.carregandoPlanos.set(true);
    this.erroPlanos.set(false);
    this.dashboardService.buscarSociosPorPlano().subscribe({
      next: (data) => {
        this.sociosPorPlano.set(data);
        this.carregandoPlanos.set(false);
      },
      error: () => {
        this.erroPlanos.set(true);
        this.carregandoPlanos.set(false);
      }
    });
  }

  carregarPagamentosRecentes() {
    this.carregandoPagamentos.set(true);
    this.erroPagamentos.set(false);
    this.dashboardService.buscarPagamentosRecentes().subscribe({
      next: (data) => {
        this.pagamentosRecentes.set(data);
        this.carregandoPagamentos.set(false);
      },
      error: () => {
        this.erroPagamentos.set(true);
        this.carregandoPagamentos.set(false);
      }
    });
  }

  carregarSociosRecentes() {
    this.carregandoSocios.set(true);
    this.erroSocios.set(false);
    this.dashboardService.buscarSociosRecentes().subscribe({
      next: (data) => {
        this.sociosRecentes.set(data);
        this.carregandoSocios.set(false);
      },
      error: () => {
        this.erroSocios.set(true);
        this.carregandoSocios.set(false);
      }
    });
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarData(data: string | null): string {
    if (!data) return '-';
    const d = new Date(data);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('pt-BR');
  }

  alturaBarra(valor: number): string {
    const max = this.maxReceita();
    const pct = max > 0 ? (valor / max) * 100 : 0;
    return `${Math.max(pct, 2)}%`;
  }

  corPlano(indice: number): string {
    const cores = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#ef4444',
      '#06b6d4',
    ];
    return cores[indice % cores.length];
  }

  inicialNome(nome: string): string {
    return nome
      .split(' ')
      .slice(0, 2)
      .map(p => p[0])
      .join('')
      .toUpperCase();
  }

  nomeMes(numero: number): string {
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return meses[numero - 1] ?? '-';
  }

  skeletonRange = [1, 2, 3, 4, 5, 6];

}
