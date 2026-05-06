import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';
import { StatusCodesModalService } from './status-codes-modal.service';
import { ModalService } from '../confirmation-modal/modal.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-status-codes-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ButtonComponent],
  templateUrl: './status-codes-modal.component.html',
  styleUrl: './status-codes-modal.component.scss',
})
export class StatusCodesModalComponent {

  config: any;
  rows: any[] = [];
  originalRows: any[] = [];

  editingIndex: number | null = null;
  form: any = {};

  deletedIndexes: Set<number> = new Set();

  constructor(
    private modal: StatusCodesModalService,
    private modalService: ModalService
  ) {
    this.modal.getState().subscribe(cfg => {
      this.config = cfg;
      console.log(cfg)
      if (cfg) {
        this.rows = JSON.parse(JSON.stringify(cfg.data || []));
        this.originalRows = JSON.parse(JSON.stringify(cfg.data || []));
        this.editingIndex = null;
        this.form = {};
        this.deletedIndexes = new Set();
      }
    });
  }

  isEditing() {
    return this.editingIndex !== null;
  }

  hasChanges(): boolean {
    return JSON.stringify(this.rows) !== JSON.stringify(this.originalRows)
      || this.deletedIndexes.size > 0;
  }

  addRow() {
    this.form = {};
    this.editingIndex = -1;
  }

  editRow(row: any, i: number) {
    if (this.isEditing()) return;
    this.form = { ...row };
    this.editingIndex = i;
  }

  markDelete(i: number) {
    this.deletedIndexes.add(i);
  }

  undoDelete(i: number) {
    this.deletedIndexes.delete(i);
  }

  saveRow() {
    if (!this.form.businessCode || !this.form.httpcode || !this.form.message) {
      return;
    }

    if (this.editingIndex === -1) {
      console.log('edited');
      this.rows.push({ ...this.form });
    } else if (this.editingIndex !== null) {
      console.log('added');
      this.rows[this.editingIndex] = { ...this.form };
    }

    this.cancelEdit();
  }

  cancelEdit() {
    this.form = {};
    this.editingIndex = null;
  }

  submit() {
    const activeRows = this.rows.filter((_, i) => !this.deletedIndexes.has(i));

    const payload = activeRows.map(row => ({
      resCodeUuid: this.ensureUuid(row),
      appApiUuid: this.config.appApiUuid,
      businessCode: row.businessCode,
      httpCode: row.httpcode,
      message: row.message,
      type: row.type,
      suggestedAction: row.suggestedAction
    }));

    this.modalService.open({
      title: 'Save',
      body: 'Are you sure you want to save?',
      icon: 'warning',
      theme: 'warning',
      showConfirm: true,
      showCancel: true
    }).pipe(first()).subscribe(res => {

      if (res === 'confirm') {

        this.modalService.update({
          title: 'Processing...',
          loading: true,
          showConfirm: false
        });

        this.modal.postStatusCodes(payload, this.config.appApiUuid).subscribe({
          next: () => {
            this.modalService.update({
              title: 'Success!',
              body: 'Saved successfully.',
              icon: 'check_circle',
              theme: 'success',
              autoClose: 1500
            });
            setTimeout(() => this.close(true), 1600);
          },
          error: () => {
            this.modalService.update({
              title: 'Error',
              body: 'Something went wrong.',
              theme: 'warning',
              autoClose: 1500
            });
          }
        });
      }
    });
  }

  close(result: boolean = false) {
    this.modal.close(result);
  }

   private generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private ensureUuid(row: any): string {
    if (!row.resCodeUuid) {
      row.resCodeUuid = this.generateUuid();
    }
    return row.resCodeUuid;
  }
}