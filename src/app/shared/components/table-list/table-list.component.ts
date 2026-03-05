import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableItem } from '../../../core/models/interface';

@Component({
  selector: 'app-table-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './table-list.component.html',
  styleUrl: './table-list.component.scss',
})
export class TableListComponent implements OnChanges, OnInit {
  @Input() dataSource: any = [];
  @Input() type: 'APP' | 'WEBSERVICE' = 'APP';

  tableList: TableItem[] = [];
  displayedColumns: string[] = ['name', 'desc', 'stableVersion', 'betaVersion', 'status', 'options'];

  constructor(
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes: ' + changes);
    console.log(changes);
    this.mapList(changes['dataSource'].currentValue)

  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  mapList(data: any[]) {
    for (let index = 0; index < data.length; index++) {

      const element = data[index];

      // this.tableList.push(this.mapToList(element))
      this.tableList = data.map(element => this.mapToList(element));

    }
  }

  mapToList(data: any): TableItem {
    console.log(data)
    return {
      id: data.id,
      appUuid: data.appUuid,
      name: data.appName,
      description: data.appDesc,
      status: data.lifecycleStatus,
      stableVersion: data.stableProdVersion,
      betaVersion: data.betaUatVersion
    }
  }

  openDetails(rowData: any) {
    if (this.type == 'WEBSERVICE') {
      this.router.navigate(['/web-service-details/' + rowData.appUuid])
    } else if (this.type == 'APP') {
      this.router.navigate(['/app-details/' + rowData.appUuid])
    }
  }

}
