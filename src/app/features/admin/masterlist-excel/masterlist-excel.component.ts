import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-masterlist-excel',
  imports: [
    MatCard,
    MatIcon,
    ButtonComponent
  ],
  templateUrl: './masterlist-excel.component.html',
  styleUrl: './masterlist-excel.component.scss',
})
export class MasterlistExcelComponent {
  isLoading = false;
  isError = false;
  isDownloaded = false;
  isUploading = false;

  constructor(
    private adminService: AdminService
  ) { }

  downloadMasterExcel() {
    if (this.isLoading) return; // Prevent double clicks

    this.isLoading = true;
    this.isDownloaded = false;

    this.adminService.getMasterExcel().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'lantern_master_file_template.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);

        // State transition
        this.isLoading = false;
        this.isDownloaded = true;

        // Revert icon back to download after 3 seconds
        setTimeout(() => {
          this.isDownloaded = false;
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.isDownloaded = false;
        this.isError = true;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadExcel(file);
      event.target.value = '';
    }
  }

  uploadExcel(file: File) {
    this.isUploading = true;
    this.isError = false;

    this.adminService.importExcel(file).subscribe({
      next: (res) => {
        if (res.flag === 'S') {
          // alert('Success: ' + res.message);
        } else {
          this.isError = true;
          // alert('Error: ' + res.message);
        }
        this.isUploading = false;
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.isError = true;
        this.isUploading = false;
      }
    });
  }

}
