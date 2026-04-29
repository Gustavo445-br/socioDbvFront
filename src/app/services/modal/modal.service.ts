import { Injectable, signal, computed, effect } from '@angular/core';

export interface ModalConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export interface ModalData {
  id: string;
  type: 'custom' | 'confirm' | 'alert';
  config: ModalConfig;
  resolve: (value: boolean | any) => void;
  reject: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals = signal<ModalData[]>([]);
  
  // Public computed signals
  readonly activeModals = computed(() => this.modals());
  readonly hasActiveModals = computed(() => this.modals().length > 0);
  readonly topModal = computed(() => {
    const modals = this.modals();
    return modals.length > 0 ? modals[modals.length - 1] : null;
  });

  constructor() {
    // Handle escape key for all modals
    effect(() => {
      const handleEscape = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
          const topModal = this.topModal();
          if (topModal && topModal.config.closeOnEscape !== false) {
            this.close(topModal.id, false);
          }
        }
      };

      if (this.hasActiveModals()) {
        document.addEventListener('keydown', handleEscape);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        return () => {
          document.removeEventListener('keydown', handleEscape);
          document.body.style.overflow = '';
        };
      } else {
        document.body.style.overflow = '';
        return () => {}; // Return empty cleanup function
      }
    });
  }

  /**
   * Open a confirmation modal (Yes/No)
   */
  confirm(config: ModalConfig): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const modalData: ModalData = {
        id: this.generateId(),
        type: 'confirm',
        config: {
          confirmText: 'Confirmar',
          cancelText: 'Cancelar',
          showCloseButton: true,
          closeOnBackdrop: true,
          closeOnEscape: true,
          ...config
        },
        resolve,
        reject
      };

      this.modals.update((modals: ModalData[]) => [...modals, modalData]);
    });
  }

  /**
   * Open an alert modal (OK only)
   */
  alert(config: ModalConfig): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const modalData: ModalData = {
        id: this.generateId(),
        type: 'alert',
        config: {
          confirmText: 'OK',
          showCloseButton: true,
          closeOnBackdrop: true,
          closeOnEscape: true,
          ...config
        },
        resolve,
        reject
      };

      this.modals.update((modals: ModalData[]) => [...modals, modalData]);
    });
  }

  /**
   * Open a custom modal
   */
  open(config: ModalConfig): { id: string; promise: Promise<any> } {
    const promise = new Promise((resolve, reject) => {
      const modalData: ModalData = {
        id: this.generateId(),
        type: 'custom',
        config: {
          showCloseButton: true,
          closeOnBackdrop: true,
          closeOnEscape: true,
          ...config
        },
        resolve,
        reject
      };

      this.modals.update((modals: ModalData[]) => [...modals, modalData]);
    });

    const id = this.modals()[this.modals().length - 1].id;
    return { id, promise };
  }

  /**
   * Close a modal by ID
   */
  close(id: string, result: any = false): void {
    const modal = this.modals().find((m: ModalData) => m.id === id);
    if (modal) {
      modal.resolve(result);
      this.modals.update((modals: ModalData[]) => modals.filter((m: ModalData) => m.id !== id));
    }
  }

  /**
   * Close the top modal
   */
  closeTop(result: any = false): void {
    const topModal = this.topModal();
    if (topModal) {
      this.close(topModal.id, result);
    }
  }

  /**
   * Close all modals
   */
  closeAll(): void {
    this.modals().forEach((modal: ModalData) => modal.resolve(false));
    this.modals.set([]);
  }

  private generateId(): string {
    return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
