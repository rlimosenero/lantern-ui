// comma-to-list.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaToList',
  standalone: true
})
export class CommaToListPipe implements PipeTransform {
  transform(value: string | null | undefined): string[] {
    if (!value) return [];
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
}