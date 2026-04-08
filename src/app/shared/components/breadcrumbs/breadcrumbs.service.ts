import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private router = inject(Router);
  private _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this._breadcrumbs$.asObservable();
  private overrides: { [url: string]: string } = {};

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.refresh();
    });
  }

  // New method to trigger the update from anywhere
  private refresh() {
    const root = this.router.routerState.snapshot.root;
    const breadcrumbs: Breadcrumb[] = [];
    this.buildBreadcrumb(root, [], breadcrumbs);
    this._breadcrumbs$.next(breadcrumbs);
  }

  private buildBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map(url => url.path));
      const fullUrl = '/' + routeUrl.join('/');
      
      // 1. Check if there is a manual override for this specific URL
      // 2. Otherwise fall back to the static route data
      let label = this.overrides[fullUrl] || route.data['breadcrumb'];

      if (label) {
        const breadcrumb = {
          label: label,
          url: fullUrl
        };
        
        // Prevent duplicates (e.g., if parent and child have same label)
        if (breadcrumbs.length === 0 || breadcrumbs[breadcrumbs.length - 1].label !== breadcrumb.label) {
          breadcrumbs.push(breadcrumb);
        }
      }

      if (route.firstChild) {
        this.buildBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
      }
    }
  }

  setOverride(url: string, label: string) {
    this.overrides[url] = label;
    this.refresh(); // Now correctly updates the stream
  }
}