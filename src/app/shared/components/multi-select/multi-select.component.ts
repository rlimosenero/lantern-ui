import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIcon
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
})
export class MultiSelectComponent implements OnInit, OnChanges {

  @Input() data: any[] = [];
  @Input() initialValue?: string;

  @Output() selectionChange = new EventEmitter<any[]>();

  private dataReady = false;
  private valueReady = false;

  options: any[] = [];
  filteredOptions: any[] = [];

  selected: any[] = [];
  isOpen = false;
  search = '';

  constructor(private eRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.options = this.data ? [...this.data] : [];
      this.filteredOptions = [...this.options];
      this.dataReady = true;
    }

    if (changes['initialValue']) {
      this.valueReady = true;
    }

    this.tryInitialize();
  }

  ngOnInit() {

  }

  initializeFromString(value: string) {
    const values = value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    values.forEach(val => {
      let found = this.options.find(o => o.value === val);

      if (!found) {
        found = {
          code: val.toUpperCase().replace(/\s+/g, '_'),
          value: val
        };
        this.options.push(found);
      }

      if (!this.selected.some(s => s.value === found.value)) {
        this.selected.push(found);
      }
    });

    this.filteredOptions = [...this.options];
    this.emit();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  isSelected(item: any): boolean {
    return this.selected.some(s => s.value === item.value);
  }

  toggleSelection(item: any) {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter(s => s.value !== item.value);
    } else {
      this.selected.push(item);

      if (!this.options.some(o => o.value === item.value)) {
        this.options.push(item);
      }
    }

    this.emit();
  }

  remove(item: any) {
    this.selected = this.selected.filter(s => s.value !== item.value);
    this.emit();
  }

  onSearchChange() {
    const term = this.search.toLowerCase().trim();

    this.filteredOptions = this.options.filter(o =>
      o.value.toLowerCase().includes(term)
    );

    const exactExists = this.options.some(
      o => o.value.toLowerCase() === term
    );

    if (term && !exactExists) {
      this.filteredOptions.unshift({
        code: term.toUpperCase().replace(/\s+/g, '_'),
        value: this.search,
        isNew: true
      });
    }
  }

  private tryInitialize() {
    if (!this.dataReady) return;

    if (this.initialValue && this.selected.length === 0) {
      this.initializeFromString(this.initialValue);
    }
  }

  emit() {
    this.selectionChange.emit(this.selected);
  }
}