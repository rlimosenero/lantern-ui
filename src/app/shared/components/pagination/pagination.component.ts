import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true, // Assuming you are using standalone
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  protected readonly Math = Math;

  // Change to Signal Inputs
  totalElements = input<number>(0);
  pageSize = input<number>(10);
  currentPage = input<number>(0);

  @Output() pageChange = new EventEmitter<number>();

  // This will now update automatically whenever the inputs change
  totalPages = computed(() => {
    const total = Math.ceil(this.totalElements() / this.pageSize());
    return total > 0 ? total : 1;
  });

  get visiblePages(): (number | null)[] {
    const total = this.totalPages();
    const current = this.currentPage(); // access signal value
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | null)[] = [];
    let l: number | undefined;

    for (let i = 0; i < total; i++) {
      if (i === 0 || i === total - 1 || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(null);
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