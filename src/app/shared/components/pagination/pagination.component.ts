import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  protected readonly Math = Math;
  @Input({ required: true }) totalElements = 0;
  @Input({ required: true }) pageSize = 10;
  @Input({ required: true }) currentPage = 0;

  @Output() pageChange = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.totalElements / this.pageSize));

  get pages(): number[] {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i);
  }

  onPageClick(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}