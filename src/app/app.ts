import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutContainer } from './components/layout/layout-container/layout-container';
import {
  TopMenu,
  NavLink,
  UserData,
  UserMenuItem,
  Notification,
} from './components/layout/top-menu/top-menu';
import { ConfirmModal } from './components/modal/confirm-modal/confirm-modal';
import { AlertModal } from './components/modal/alert-modal/alert-modal';
import { ModalService } from './services/modal/modal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutContainer, TopMenu, ConfirmModal, AlertModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Sócio DBV');

  // Sample navigation links
  protected readonly navLinks = signal<NavLink[]>([
    { label: 'Sócios', route: '/socios' },
    { label: 'Benefícios', route: '/beneficios' },
    { label: 'Planos', route: '/planos' },
    { label: 'Pagamentos', route: '/pagamentos' },
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Relatórios', route: '/reports' },
    { label: 'Configurações', route: '/settings' },
  ]);

  // Sample user data
  protected readonly userData = signal<UserData>({
    name: 'João Silva',
    email: 'joao.silva@example.com',
  });

  // Sample user menu items
  protected readonly userMenuItems = signal<UserMenuItem[]>([
    {
      label: 'Meu Perfil',
      action: () => console.log('Navegando para perfil'),
    },
    {
      label: 'Configurações',
      action: () => console.log('Navegando para configurações'),
    },
    {
      label: 'Ajuda',
      action: () => console.log('Abrindo ajuda'),
    },
    {
      label: 'Sair',
      action: () => this.handleLogout(),
      isDanger: true,
    },
  ]);

  // Sample notifications
  protected readonly notifications = signal<Notification[]>([
    {
      id: '1',
      title: 'Nova mensagem',
      message: 'Você recebeu uma nova mensagem de Maria Santos',
      time: 'há 5 minutos',
      isRead: false,
    },
    {
      id: '2',
      title: 'Atualização do sistema',
      message: 'O sistema será atualizado hoje às 22h',
      time: 'há 1 hora',
      isRead: false,
    },
    {
      id: '3',
      title: 'Relatório concluído',
      message: 'Seu relatório mensal foi gerado com sucesso',
      time: 'há 2 horas',
      isRead: true,
    },
  ]);

  constructor(private modalService: ModalService) {}

  // Example: Open confirmation modal
  protected async openConfirmModal(): Promise<void> {
    const confirmed = await this.modalService.confirm({
      title: 'Confirmar ação',
      message: 'Tem certeza que deseja realizar esta ação? Esta operação não pode ser desfeita.',
      confirmText: 'Sim, continuar',
      cancelText: 'Cancelar',
      isDanger: false,
    });

    if (confirmed) {
      await this.modalService.alert({
        title: 'Sucesso',
        message: 'Ação realizada com sucesso!',
        confirmText: 'OK',
      });
    }
  }

  // Example: Open alert modal
  protected async openAlertModal(): Promise<void> {
    await this.modalService.alert({
      title: 'Informação',
      message: 'Esta é uma mensagem informativa para o usuário.',
      confirmText: 'Entendi',
    });
  }

  // Example: Handle logout
  protected async handleLogout(): Promise<void> {
    const confirmed = await this.modalService.confirm({
      title: 'Sair do sistema',
      message: 'Tem certeza que deseja sair?',
      confirmText: 'Sair',
      cancelText: 'Cancelar',
      isDanger: true,
    });

    if (confirmed) {
      console.log('Usuário saiu do sistema');
      // Implement logout logic here
    }
  }
}
