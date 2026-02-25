import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, searchText: string): SafeHtml {
    if (!searchText || !value) return value;

    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value.toString();

    const re = new RegExp(`(${searchText})`, 'gi');

    const result = stringValue.replace(re, '<span style="font-weight: 600; color: #BA1A1A;">$1</span>');

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}