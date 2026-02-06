import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { MainShellComponent } from './layout/main-shell/main-shell.component';
import { AdminAnalyticsComponent } from './pages/admin-analytics/admin-analytics.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: MainShellComponent, // Wrap your dashboard/catalogue inside the shell
    children: [
      { path: 'admin', component: AdminAnalyticsComponent },
      { path: 'catalogue', component: CatalogueComponent },
      { path: '', redirectTo: 'admin', pathMatch: 'full' } // Default inside the shell
      
    ]
  }
];