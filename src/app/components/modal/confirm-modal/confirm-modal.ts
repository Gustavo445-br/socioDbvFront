import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../modal/modal';
import { ModalService, ModalData } from '../../../services/modal/modal.service';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule, Modal],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModal implements OnInit {
  protected modalService = ModalService;

  constructor(protected modalServiceInstance: ModalService) {}

  ngOnInit(): void {}

  getActiveModals(): ModalData[] {
    return this.modalServiceInstance.activeModals()
      .filter(m => m.type === 'confirm');
  }

  handleConfirm(modalId: string): void {
    this.modalServiceInstance.close(modalId, true);
  }

  handleCancel(modalId: string): void {
    this.modalServiceInstance.close(modalId, false);
  }

  handleClose(modalId: string): void {
    this.modalServiceInstance.close(modalId, false);
  }
}
