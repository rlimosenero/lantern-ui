import { Component } from '@angular/core';
import { DataFieldsModalService } from './data-fields-modal.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';
import { ModalService } from '../confirmation-modal/modal.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-data-fields-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ButtonComponent],
  templateUrl: './data-fields-modal.component.html',
  styleUrl: './data-fields-modal.component.scss',
})
export class DataFieldsModalComponent {
  config: any;
  rows: any[] = [];
  originalRows: any[] = [];
  isNewData: boolean = true;

  editingIndex: number | null = null;
  form: any = {};

  deletedIndexes: Set<number> = new Set();
  validationError: boolean = false;

  constructor(
    private modal: DataFieldsModalService,
    private modalService: ModalService
  ) {
    this.modal.getState().subscribe(cfg => {
      this.config = cfg;
      if (cfg) {
        const activeDataLen = cfg.data ? cfg.data.length : 0;
        const unusedDataLen = cfg.unusedData ? cfg.unusedData.length : 0;

        this.isNewData = (activeDataLen === 0 && unusedDataLen === 0);

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

    const contentChanged = JSON.stringify(this.rows) !== JSON.stringify(this.originalRows);

    const deletionsChanged = this.deletedIndexes.size > 0;

    return contentChanged || deletionsChanged;
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
    const nameKey = this.config.columns.find((c: any) => c.required)?.key;

    if (nameKey && !this.form[nameKey]) {
      this.triggerValidationError();
      return;
    }

    if (this.editingIndex === -1) {
      this.rows.push({ ...this.form });
    } else if (this.editingIndex !== null) {
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

    const activePayload = activeRows.map(row => {
      return {
        dataFieldUuid: row.dataFieldUuid || null,
        appApiUuid: this.config.appApiUuid,
        payloadType: this.determinePayloadType(this.config.title),
        fieldName: row.fieldName || row.parameterName || row.headerName || '',
        dataTypeFormat: row.typeAndFormat || '',
        description: row.description || '',
        isRequired: !!row.isRequired,
        sampleValue: row.sampleValue || '',
        validation: row.validationRules || '',
        transformationLogic: row.transformationLogic || '',
        defaultValue: row.defaultValue || '',
        sourceApplicationName: row.sourceOrDomainApplication || '',
        sourceFieldName: row.sourceOrDomainFieldName || '',
        endpoint: row.endpoint || ''
      };
    });

    const unusedData = this.config.unusedData || [];
    const finalPayload = [...activePayload, ...unusedData];

    const appApiUuid = this.config.appApiUuid;

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
          body: 'Please wait...',
          loading: true,
          showConfirm: false,
          showCancel: false
        });

        if (this.isNewData) {
          this.modal.addNewDataFields(finalPayload, appApiUuid).subscribe({
            next: () => {
              this.modalService.update({
                title: 'Success!', body: 'Entries Added', icon: 'check_circle',
                theme: 'success', loading: false, autoClose: 1500
              });
              setTimeout(() => this.close(true), 1600);
            },
            error: () => {
              this.modalService.update({
                title: 'Error', body: 'Something went wrong.', icon: 'error',
                theme: 'warning', loading: false, autoClose: 1500
              });
            }
          });
        } else {
          this.modal.updateDataFields(finalPayload, appApiUuid).subscribe({
            next: () => {
              this.modalService.update({
                title: 'Success!', body: 'Changes saved', icon: 'check_circle',
                theme: 'success', loading: false, autoClose: 1500
              });
              setTimeout(() => this.close(true), 1600);
            },
            error: () => {
              this.modalService.update({
                title: 'Error', body: 'Something went wrong.', icon: 'error',
                theme: 'warning', loading: false, autoClose: 1500
              });
            }
          });
        }
      }
    });
  }

  private determinePayloadType(title: string): string {
    switch (title) {
      case 'URL Path Parameters': return 'URL_PATH_PARAMETER';
      case 'Request Header': return 'REQUEST_HEADER';
      case 'Request Body': return 'REQUEST_BODY';
      case 'Response Headers': return 'RESPONSE_HEADER';
      case 'Response Body': return 'RESPONSE_BODY';
      default: return 'REQUEST_BODY';
    }
  }

  close(isSuccess: boolean = false) {
    this.resetState();
    this.modal.close(isSuccess);
  }


  isInvalid(col: any) {
    return col.required && !this.form[col.key];
  }

  private resetState() {
    this.config = null;
    this.rows = [];
    this.originalRows = [];
    this.form = {};
    this.editingIndex = null;
    this.deletedIndexes = new Set();
  }

  private triggerValidationError() {
    this.validationError = true;
    setTimeout(() => {
      this.validationError = false;
    }, 2000);
  }
}