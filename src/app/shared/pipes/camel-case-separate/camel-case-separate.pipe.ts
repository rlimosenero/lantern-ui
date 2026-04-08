import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseSeparate',
})
export class CamelCaseSeparatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    // Regex to insert a space before any capital letter that is not the first character
    return value.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

}
