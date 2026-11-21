import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split',
  standalone: true
})
export class SplitPipe implements PipeTransform {

  transform(
    value: string | null | undefined,
    separator = ','
  ): string[] {

    if (!value?.trim()) {
      return [];
    }

    const result: string[] = [];

    let current = '';
    let depth = 0;

    for (const char of value) {

      if (char === '(') {
        depth++;
      }

      if (char === ')') {
        depth--;
      }

      if (char === separator && depth === 0) {
        result.push(current.trim());
        current = '';
        continue;
      }

      current += char;
    }

    if (current.trim()) {
      result.push(current.trim());
    }

    return result;
  }
}