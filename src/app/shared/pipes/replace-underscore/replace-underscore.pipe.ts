import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceUnderscore',
  standalone: true
})
export class ReplaceUnderscorePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    
    // Replaces all underscores with a space
    return value.replace(/_/g, ' ');
  }
}