import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Replacing RouterModule with specific tools
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/auth.service';
@Component({
  selector: 'app-main-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLinkActive,
  ],
  templateUrl: './main-shell.component.html',
  styleUrl: './main-shell.component.scss',
})
export class MainShellComponent {
  public auth = inject(AuthService);

  logout(){
    console.log('Logging out');
    this.auth.logout();
  }

}
