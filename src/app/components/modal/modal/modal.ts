import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.modal-open]': 'isOpen()'
  }
})
export class Modal {
  // Inputs
  isOpen = input<boolean>(false);
  title = input<string>('');
  showCloseButton = input<boolean>(true);
  closeOnBackdrop = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  // Outputs
  close = output<void>();
  backdropClick = output<void>();

  // State
  private focusableElements = signal<HTMLElement[]>([]);
  private previousActiveElement = signal<HTMLElement | null>(null);

  constructor() {
    // Trap focus inside modal when open
    effect(() => {
      if (this.isOpen()) {
        this.trapFocus();
      } else {
        this.restoreFocus();
      }
    });

    // Handle escape key
    effect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.closeOnEscape()) {
          this.handleClose();
        }
      };

      if (this.isOpen()) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
      
      return () => {}; // Return empty cleanup function when modal is closed
    });
  }

  handleClose(): void {
    this.close.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && this.closeOnBackdrop()) {
      this.backdropClick.emit();
      this.handleClose();
    }
  }

  private trapFocus(): void {
    // Save currently focused element
    this.previousActiveElement.set(document.activeElement as HTMLElement);

    // Find all focusable elements in modal
    setTimeout(() => {
      const modalElement = document.querySelector('.modal--open');
      if (!modalElement) return;

      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(', ');

      const elements = Array.from(
        modalElement.querySelectorAll<HTMLElement>(focusableSelectors)
      );

      this.focusableElements.set(elements);

      // Focus first element
      if (elements.length > 0) {
        elements[0].focus();
      }

      // Handle tab navigation
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        const focusable = this.focusableElements();
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      };

      document.addEventListener('keydown', handleTab);
    }, 0);
  }

  private restoreFocus(): void {
    const previousElement = this.previousActiveElement();
    if (previousElement) {
      previousElement.focus();
    }
  }
}
