import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { BreadcrumbService } from './breadcrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent {
  private breadcrumbService = inject(BreadcrumbService);
  breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
}