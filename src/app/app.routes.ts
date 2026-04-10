import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainShellComponent } from './shared/layouts/main-shell/main-shell.component';
import { AdminAnalyticsComponent } from './features/admin/admin-analytics/admin-analytics.component';
import { ApplicationComponent } from './features/application/application/application.component';
import { AddAppComponent } from './features/application/add-app/add-app.component';
import { AppDetailsComponent } from './features/application/app-details/app-details.component';
import { WebServicesDetailsComponent } from './features/web-services/web-services-details/web-services-details.component';
import { WebServicesDashboardComponent } from './features/web-services/web-services-dashboard/web-services-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { SearchComponent } from './features/search/search-page/search.component';
import { MasterlistExcelComponent } from './features/admin/masterlist-excel/masterlist-excel.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'admin', component: AdminAnalyticsComponent, data: { breadcrumb: 'Admin' } },
      { path: 'masterlist-io', component: MasterlistExcelComponent },
      {
        path: 'application',
        data: { breadcrumb: 'Applications' },
        children: [
          {
            path: '',
            component: ApplicationComponent,
            data: { breadcrumb: null }
          },
          {
            path: 'add-app',
            component: AddAppComponent,
            data: { breadcrumb: 'Add New App' }
          },
          {
            path: 'details/:id',
            component: AppDetailsComponent,
            data: {
              breadcrumb: 'Application Details',
              parentBreadcrumb: 'Search',
              parentUrl: '/search'
            }
          }
        ]
      },
      {
        path: 'web-services',
        data: { breadcrumb: 'Web Services' },
        children: [
          {
            path: '',
            component: WebServicesDashboardComponent,
            data: { breadcrumb: null }
          },
          {
            path: 'details/:id',
            component: WebServicesDetailsComponent,
            data: {
              breadcrumb: 'Web Service Details',
              parentBreadcrumb: 'Search',
              parentUrl: '/search'
            }
          }
        ]
      },
      {
        path: 'search',
        component: SearchComponent,
        data: { breadcrumb: 'Search' } 
      },
      {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];