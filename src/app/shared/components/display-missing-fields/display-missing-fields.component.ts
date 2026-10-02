import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MissingField {
  fieldName: string;
  required: boolean;
}

@Component({
  selector: 'app-display-missing-fields',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-missing-fields.component.html',
  styleUrl: './display-missing-fields.component.scss',
})
export class DisplayMissingFieldsComponent {

  @Input() missingFields: MissingField[] = [];

  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, char => char.toUpperCase());
  }

}