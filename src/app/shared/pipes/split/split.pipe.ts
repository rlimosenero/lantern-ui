import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split',
  standalone: true
})
export class SplitPipe implements PipeTransform {
  transform(value: string | null | undefined, separator: string = ','): string[] {
    if (!value) return [];
    return value.split(separator).map(item => item.trim()).filter(item => item !== '');
  }
}