import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../modal/modal';
import { ModalService, ModalData } from '../../../services/modal/modal.service';

@Component({
  selector: 'app-alert-modal',
  imports: [CommonModule, Modal],
  templateUrl: './alert-modal.html',
  styleUrl: './alert-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertModal implements OnInit {
  protected modalService = ModalService;

  constructor(protected modalServiceInstance: ModalService) {}

  ngOnInit(): void {}

  getActiveModals(): ModalData[] {
    return this.modalServiceInstance.activeModals()
      .filter(m => m.type === 'alert');
  }

  handleOk(modalId: string): void {
    this.modalServiceInstance.close(modalId, true);
  }

  handleClose(modalId: string): void {
    this.modalServiceInstance.close(modalId, true);
  }
}
