import { Component, ChangeDetectionStrategy, signal, input, computed, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface NavLink {
  label: string;
  route: string;
  icon?: string;
}

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export interface UserMenuItem {
  label: string;
  action: () => void;
  icon?: string;
  isDanger?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

@Component({
  selector: 'app-top-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class TopMenu {
  // Inputs
  appName = input<string>('SocioDBV');
  logo = input<string>('');
  navLinks = input<NavLink[]>([]);
  user = input<UserData | null>(null);
  userMenuItems = input<UserMenuItem[]>([]);
  notifications = input<Notification[]>([]);

  // Computed values
  unreadNotificationsCount = computed(() => {
    return this.notifications().filter(n => !n.isRead).length;
  });

  hasNotifications = computed(() => this.notifications().length > 0);
  hasUser = computed(() => this.user() !== null);
  userInitials = computed(() => {
    const user = this.user();
    if (!user) return '';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  // State
  isNotificationsOpen = signal(false);
  isUserMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);

  // Methods
  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.isNotificationsOpen.update(v => !v);
    this.isUserMenuOpen.set(false);
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen.update(v => !v);
    this.isNotificationsOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
    this.isNotificationsOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  onDocumentClick(event: Event): void {
    // Close all dropdowns when clicking outside
    this.isNotificationsOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  closeAllDropdowns(): void {
    this.isNotificationsOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  handleNotificationClick(notification: Notification): void {
    // Mark as read logic would go here
    this.closeAllDropdowns();
  }

  handleUserMenuItemClick(item: UserMenuItem): void {
    item.action();
    this.closeAllDropdowns();
  }
}
