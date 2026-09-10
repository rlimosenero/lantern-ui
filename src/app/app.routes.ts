import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainShellComponent } from './shared/layouts/main-shell/main-shell.component';
import { AdminAnalyticsComponent } from './features/admin/admin-analytics/admin-analytics.component';
import { ApplicationComponent } from './features/application/application/application.component';
import { AppDetailsComponent } from './features/application/application-details/app-details.component';
import { WebServicesDetailsComponent } from './features/web-services/web-services-details/web-services-details.component';
import { WebServicesDashboardComponent } from './features/web-services/web-services-dashboard/web-services-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { SearchComponent } from './features/search/search-page/search.component';
import { MasterlistExcelComponent } from './features/admin/masterlist-excel/masterlist-excel.component';
import { ApplicationFormComponent } from './features/application/application-form/application-form.component';
import { WebServicesFormComponent } from './features/web-services/web-services-form/web-services-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainShellComponent,
    canActivate: [authGuard],
    children: [
      // { path: 'analytics', component: AdminAnalyticsComponent, data: { breadcrumb: 'Analytics' } },
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
            path: 'new',
            component: ApplicationFormComponent,
            data: { breadcrumb: 'Add Application' }
          },
          {
            path: 'details/:id',
            // component: AppDetailsComponent,
            data: {
              breadcrumb: 'Application Details',
              parentBreadcrumb: 'Search',
              parentUrl: '/search'
            },
            children: [
              {
                path: '',
                component: AppDetailsComponent,
              },
              {
                path: 'edit',
                component: ApplicationFormComponent,
                data: { breadcrumb: 'Edit Application Detail' }
              },
              {
                path: 'add-web-service',
                component: WebServicesFormComponent,
                data: { breadcrumb: 'Add Web Service' }
              }
            ]
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
            // component: WebServicesDetailsComponent,
            data: {
              breadcrumb: 'Web Service Details',
              parentBreadcrumb: 'Search',
              parentUrl: '/search'
            },
            children: [
              {
                path: '',
                component: WebServicesDetailsComponent,
              },
              {
                path: 'edit',
                component: WebServicesFormComponent,
                data: { breadcrumb: 'Edit Web Service Detail' }
              },
            ]
          }
        ]
      },
      {
        path: 'search',
        component: SearchComponent,
        data: { breadcrumb: 'Search' }
      },
      // {
      //   path: '',
      //   redirectTo: 'admin',
      //   pathMatch: 'full'
      // }
    ]
  },
  { path: '**', redirectTo: 'login' }
];