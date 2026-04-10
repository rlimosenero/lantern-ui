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

  private refresh() {
    const root = this.router.routerState.snapshot.root;
    const breadcrumbs: Breadcrumb[] = [];
    this.buildBreadcrumb(root, [], breadcrumbs);
    this._breadcrumbs$.next(breadcrumbs);
  }

  private buildBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map(url => url.path));
      const fullUrl = '/' + routeUrl.join('/').replace(/\/$/, '') || '/';
      const pathOnly = fullUrl.split('?')[0];

      // --- NEW LOGIC: Check for explicit Virtual Parent Override ---
      // If we have set a manual override for '/search', we want to skip the 
      // standard 'Application' or 'Web Service' parents to keep it clean.
      const isDetailSearchMode = !!this.overrides['/search'];

      // If we are in "Search Mode", skip the intermediate containers like 'Web Services'
      // unless they ARE the search page itself.
      const isContainer = route.data['breadcrumb'] === 'Web Services' || route.data['breadcrumb'] === 'Applications';

      if (isDetailSearchMode && isContainer) {
        // Skip adding 'Web Services' to the array
      } else {
        // Handle the virtual parent injection
        if (route.data['parentBreadcrumb'] && breadcrumbs.length === 0 && isDetailSearchMode) {
          breadcrumbs.push({
            label: route.data['parentBreadcrumb'],
            url: route.data['parentUrl']
          });
        }

        let label = this.overrides[pathOnly] || this.overrides[fullUrl] || route.data['breadcrumb'];

        if (label && label !== null) {
          const breadcrumb = { label, url: fullUrl };
          const isDuplicate = breadcrumbs.length > 0 &&
            breadcrumbs[breadcrumbs.length - 1].label === label;

          if (!isDuplicate) {
            breadcrumbs.push(breadcrumb);
          }
        }
      }

      if (route.firstChild) {
        this.buildBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
      }
    }
  }

  clearAllOverrides() {
    this.overrides = {};
    this.refresh();
  }

  setOverride(url: string, label: string) {
    // Standardize URL to path only before saving to avoid param mismatches
    const cleanUrl = url.split('?')[0];
    this.overrides[cleanUrl] = label;
    this.refresh();
  }

  // Helper to clear specific overrides if needed when navigating away
  clearOverride(url: string) {
    const cleanUrl = url.split('?')[0];
    delete this.overrides[cleanUrl];
    this.refresh();
  }
}