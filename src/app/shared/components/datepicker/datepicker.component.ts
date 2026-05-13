import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  imports: [CommonModule, FormsModule],
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
export class DatepickerComponent implements ControlValueAccessor, OnInit, OnChanges {

  private dragType: 'month' | 'day' | 'year' | null = null;
  private dragStartY = 0;

  @Input() placeholder = 'Select Date';
  @Input() disabled = false;

  /**
   * Optional default value
   * format: yyyy-MM-dd
   */
  @Input() value: string | null = null;

  @Output() dateChange = new EventEmitter<string>();

  isOpen = false;

  months = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
  ];

  days: string[] = [];
  years: number[] = [];

  selectedMonth = 0;
  selectedDay = 1;
  selectedYear = 2000;

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
    } else {
      this.setToday();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['value']?.currentValue) {
      this.applyDate(changes['value'].currentValue);
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

  applyDate(value: string) {

    const date = new Date(value);

    if (isNaN(date.getTime())) return;

    this.selectedMonth = date.getMonth();
    this.selectedDay = date.getDate();
    this.selectedYear = date.getFullYear();

    this.generateDays();

    /**
     * prevent invalid day after changing month/year
     */
    const maxDays = this.getDaysInMonth(
      this.selectedMonth,
      this.selectedYear
    );

    if (this.selectedDay > maxDays) {
      this.selectedDay = maxDays;
    }

    this.updateDisplay();
  }

  generateYears() {

    const currentYear = new Date().getFullYear();

    for (let i = currentYear - 100; i <= currentYear + 50; i++) {
      this.years.push(i);
    }
  }

  generateDays() {

    const totalDays = this.getDaysInMonth(
      this.selectedMonth,
      this.selectedYear
    );

    this.days = Array.from(
      { length: totalDays },
      (_, i) => String(i + 1).padStart(2, '0')
    );

    /**
     * prevent invalid selected day
     */
    if (this.selectedDay > totalDays) {
      this.selectedDay = totalDays;
    }
  }

  getDaysInMonth(month: number, year: number): number {

    /**
     * JS trick:
     * month + 1 with day 0
     * returns last day of current month
     */

    return new Date(year, month + 1, 0).getDate();
  }

  setToday() {

    const today = new Date();

    this.selectedMonth = today.getMonth();
    this.selectedDay = today.getDate();
    this.selectedYear = today.getFullYear();

    this.generateDays();
    this.updateDisplay();
  }

  togglePicker() {

    if (this.disabled) return;

    this.isOpen = !this.isOpen;
  }

  confirmDate() {

    this.updateDisplay();

    this.isOpen = false;

    this.onChange(this.outputValue);

    this.dateChange.emit(this.outputValue);
  }

  updateDisplay() {

    this.generateDays();

    const month = this.months[this.selectedMonth];

    const day = String(this.selectedDay)
      .padStart(2, '0');

    this.displayValue =
      `${month} ${day} ${this.selectedYear}`;

    const formattedMonth =
      String(this.selectedMonth + 1)
        .padStart(2, '0');

    this.outputValue =
      `${this.selectedYear}-${formattedMonth}-${day}`;
  }

  scrollMonth(direction: number) {

    this.selectedMonth =
      (this.selectedMonth + direction + 12) % 12;

    this.generateDays();
  }

  scrollDay(direction: number) {

    const maxDays = this.getDaysInMonth(
      this.selectedMonth,
      this.selectedYear
    );

    this.selectedDay += direction;

    if (this.selectedDay > maxDays) {
      this.selectedDay = 1;
    }

    if (this.selectedDay < 1) {
      this.selectedDay = maxDays;
    }
  }

  scrollYear(direction: number) {

    const min = this.years[0];
    const max = this.years[this.years.length - 1];

    this.selectedYear += direction;

    if (this.selectedYear > max) {
      this.selectedYear = min;
    }

    if (this.selectedYear < min) {
      this.selectedYear = max;
    }

    this.generateDays();
  }

  onWheel(
    event: WheelEvent,
    type: 'month' | 'day' | 'year'
  ) {

    event.preventDefault();

    const direction = event.deltaY > 0 ? 1 : -1;

    switch (type) {

      case 'month':
        this.scrollMonth(direction);
        break;

      case 'day':
        this.scrollDay(direction);
        break;

      case 'year':
        this.scrollYear(direction);
        break;
    }
  }

  getPrevMonth() {
    return this.months[
      (this.selectedMonth - 1 + 12) % 12
    ];
  }

  getNextMonth() {
    return this.months[
      (this.selectedMonth + 1) % 12
    ];
  }

  getPrevDay() {

    const maxDays = this.getDaysInMonth(
      this.selectedMonth,
      this.selectedYear
    );

    return String(
      this.selectedDay - 1 <= 0
        ? maxDays
        : this.selectedDay - 1
    ).padStart(2, '0');
  }

  getNextDay() {

    const maxDays = this.getDaysInMonth(
      this.selectedMonth,
      this.selectedYear
    );

    return String(
      this.selectedDay + 1 > maxDays
        ? 1
        : this.selectedDay + 1
    ).padStart(2, '0');
  }

  getPrevYear() {
    return this.selectedYear - 1;
  }

  getNextYear() {
    return this.selectedYear + 1;
  }

  startDrag(
    event: MouseEvent,
    type: 'month' | 'day' | 'year'
  ) {

    event.preventDefault();

    this.dragType = type;
    this.dragStartY = event.clientY;

    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.stopDrag);
  }

  onDrag = (event: MouseEvent) => {

    if (!this.dragType) return;

    const diff = event.clientY - this.dragStartY;

    if (Math.abs(diff) < 18) return;

    const direction = diff > 0 ? -1 : 1;

    switch (this.dragType) {

      case 'month':
        this.scrollMonth(direction);
        break;

      case 'day':
        this.scrollDay(direction);
        break;

      case 'year':
        this.scrollYear(direction);
        break;
    }

    this.dragStartY = event.clientY;
  }

  stopDrag = () => {

    this.dragType = null;

    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.stopDrag);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {

    const clickedInside =
      event.target.closest('.wheel-datepicker');

    if (!clickedInside) {
      this.isOpen = false;
    }
  }
}
