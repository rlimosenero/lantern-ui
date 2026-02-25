import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { HighlightPipe } from '../../shared/pipes/highlight/highlight.pipe';
import { FormsModule } from '@angular/forms';
import { resultListTable } from '../../core/models/static';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    HighlightPipe,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  dataSource: any = [];
  searchList: any = resultListTable[0].data.results;
  searchQuery: string = 'Bearer';
  displayedColumns: string[] = ['type', 'name', 'match', 'view'];
  filterWebService = true;
  filterApplication = true;


  ngOnInit(): void {
    
  }

  onFilterChange() {
    console.log('toggle');
  }
}
