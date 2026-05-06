import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { DataFieldsModalComponent } from './shared/components/data-fields-modal/data-fields-modal.component';
import { StatusCodesModalComponent } from './shared/components/status-codes-modal/status-codes-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ToastComponent, 
    ConfirmationModalComponent, 
    DataFieldsModalComponent,
    StatusCodesModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dashboard';
}
