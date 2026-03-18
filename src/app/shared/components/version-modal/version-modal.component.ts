import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VersionModalService } from './version-modal.service';
import { SplitPipe } from '../../pipes/split/split.pipe';
import { MatIcon } from '@angular/material/icon';
import { PaginationComponent } from '../pagination/pagination.component';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-version-modal',
  imports: [
    SplitPipe,
    MatIcon,
    PaginationComponent,
    DatePipe,
    MatTableModule,
    SplitPipe,
    LoaderComponent
  ],
  templateUrl: './version-modal.component.html',
  styleUrl: './version-modal.component.scss',
})
export class VersionModalComponent implements OnInit {
  displayedAuditColumns: string[] = ['eventDate', 'event', 'actor', 'newValues'];
  details: any = [];
  auditData: any = [];
  isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { uuid: string, type: string },
    private versionModalService: VersionModalService
  ) { }

  ngOnInit(): void {
    this.fetchVersionDetails();
    this.fetchAudit();
  }

  mockAppList() {
    return new Array(5).fill({});
  }

  fetchVersionDetails() {
    this.versionModalService.getVersionDetails(this.data.uuid).subscribe({
      next: (res: any) => {
        // console.log(res);
        this.details = res.data
      },
      error: (err) => console.error(err)
    });
  }

  fetchAudit() {
    this.loadData(0);
  }

  loadData(pageNumber: number) {
    this.isLoading = true;
    this.versionModalService.getAudit(this.data.uuid, pageNumber).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
      next: (res: any) => {
        console.log(res);
        this.auditData = res.data
      },
      error: (err) => console.error(err)
    });
  }

  onHandlePage(newPage: number) {
    this.auditData.results = this.mockAppList();
    this.loadData(newPage);
  }


}
