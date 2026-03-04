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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainShellComponent, // Wrap your dashboard/catalogue inside the shell
    canActivate: [authGuard],
    children: [
      { path: 'admin', component: AdminAnalyticsComponent },
      { path: 'search', component: SearchComponent },
      { path: 'application', component: ApplicationComponent },
      { path: 'add-app', component: AddAppComponent },
      { path: 'app-details/:id', component: AppDetailsComponent },
      { path: 'web-services', component: WebServicesDashboardComponent },
      { path: 'web-service-details/:id', component: WebServicesDetailsComponent },
      { path: '', redirectTo: 'admin', pathMatch: 'full' } // Default inside the shell
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];