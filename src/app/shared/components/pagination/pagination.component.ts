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

  // Generates the array with numbers for pages and `null` for the ellipsis
  get visiblePages(): (number | null)[] {
    const total = this.totalPages();
    const current = this.currentPage;
    const delta = 1; // How many pages to show beside the current page
    const range: number[] = [];
    const rangeWithDots: (number | null)[] = [];
    let l: number | undefined;

    // Build the core list of pages we want to show
    for (let i = 0; i < total; i++) {
      if (i === 0 || i === total - 1 || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    // Insert nulls (...) where gaps exist
    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1); // Fill gap if it's exactly 1 page
        } else if (i - l !== 1) {
          rangeWithDots.push(null); // Insert ellipsis for larger gaps
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  onPageClick(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}