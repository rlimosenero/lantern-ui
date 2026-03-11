import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VersionModalService } from './version-modal.service';
import { SplitPipe } from '../../pipes/split/split.pipe';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-version-modal',
  imports: [
    SplitPipe,
    MatIcon
  ],
  templateUrl: './version-modal.component.html',
  styleUrl: './version-modal.component.scss',
})
export class VersionModalComponent implements OnInit {

  details: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { uuid: string },
    private versionModalService: VersionModalService
  ) { }

  ngOnInit(): void {
    // console.log('Received UUID in modal:', this.data.uuid);
    this.fetchVersionDetails();
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
}
