import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Application, TableItem } from '../../../core/models/interface';
import { ApplicationApiService } from '../services/application-api-service.service';
import { TableListComponent } from '../../../shared/components/table-list/table-list.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-application',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    TableListComponent
  ],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss',
})
export class ApplicationComponent implements OnInit {
  public auth = inject(AuthService);
  private route = inject(Router);
  displayedColumns: string[] = ['name', 'desc', 'version', 'status', 'options'];

  appList: TableItem[] | [] = [];

  constructor(
    private applicationApiService: ApplicationApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchAppDetails();
  }

  fetchAppDetails() {
    this.appList = this.applicationApiService.getAppList()[0].data.results;
  }

}
