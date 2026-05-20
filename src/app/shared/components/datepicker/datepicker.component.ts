import {
  CommonModule
} from '@angular/common';

import {
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent
  implements
  ControlValueAccessor,
  OnInit,
  OnChanges {

  @Input() placeholder = 'Select Date';

  @Input() disabled = false;

  @Input() value: string | null = null;

  @Output() dateChange =
    new EventEmitter<string>();

  isOpen = false;

  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  years: number[] = [];

  days: number[] = [];

  selectedMonth: number | null = null;
  selectedDay: number | null = null;
  selectedYear: number | null = null;

  displayValue = '';
  outputValue = '';

  private onChange = (_: any) => { };
  private onTouched = () => { };

  constructor() {
    this.generateYears();
  }

  ngOnInit(): void {

    if (this.value) {
      this.applyDate(this.value);
    }

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['value']?.currentValue) {
      this.applyDate(
        changes['value'].currentValue
      );
    }

  }

  writeValue(value: string): void {

    if (!value) return;

    this.applyDate(value);

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  togglePicker() {

    if (this.disabled) return;

    this.isOpen = !this.isOpen;

  }

  generateYears() {

    const currentYear =
      new Date().getFullYear();

    for (
      let i = currentYear - 100;
      i <= currentYear + 50;
      i++
    ) {

      this.years.push(i);

    }

  }

  onMonthChange() {

    this.generateDays();

    /**
     * clear invalid day
     */

    if (
      this.selectedDay &&
      !this.days.includes(this.selectedDay)
    ) {

      this.selectedDay = null;

    }

  }

  onYearChange() {

    this.generateDays();

    /**
     * leap year handling
     */

    if (
      this.selectedDay &&
      !this.days.includes(this.selectedDay)
    ) {

      this.selectedDay = null;

    }

  }

  onDayChange() {
    // optional
  }

  generateDays() {

    if (
      this.selectedMonth === null ||
      this.selectedYear === null
    ) {

      this.days = [];

      return;

    }

    const totalDays =
      this.getDaysInMonth(
        this.selectedMonth,
        this.selectedYear
      );

    this.days = Array.from(
      { length: totalDays },
      (_, i) => i + 1
    );

  }

  getDaysInMonth(
    month: number,
    year: number
  ): number {

    return new Date(
      year,
      month + 1,
      0
    ).getDate();

  }

  canConfirm(): boolean {

    return (
      this.selectedMonth !== null &&
      this.selectedDay !== null &&
      this.selectedYear !== null
    );

  }

  confirmDate() {

    if (!this.canConfirm()) return;

    const month =
      String(this.selectedMonth! + 1)
        .padStart(2, '0');

    const day =
      String(this.selectedDay)
        .padStart(2, '0');

    this.outputValue =
      `${this.selectedYear}-${month}-${day}`;

    this.displayValue =
      `${this.months[this.selectedMonth!]} ${day}, ${this.selectedYear}`;

    this.onChange(this.outputValue);

    this.onTouched();

    this.dateChange.emit(
      this.outputValue
    );

    this.isOpen = false;

  }

  applyDate(value: string) {

    const date = new Date(value);

    if (isNaN(date.getTime())) return;

    this.selectedMonth =
      date.getMonth();

    this.selectedDay =
      date.getDate();

    this.selectedYear =
      date.getFullYear();

    this.generateDays();

    const month =
      String(this.selectedMonth + 1)
        .padStart(2, '0');

    const day =
      String(this.selectedDay)
        .padStart(2, '0');

    this.outputValue =
      `${this.selectedYear}-${month}-${day}`;

    this.displayValue =
      `${this.months[this.selectedMonth]} ${day}, ${this.selectedYear}`;

  }

  @HostListener(
    'document:click',
    ['$event']
  )
  clickOutside(event: any) {

    const clickedInside =
      event.target.closest(
        '.custom-datepicker'
      );

    if (!clickedInside) {
      this.isOpen = false;
    }

  }

}