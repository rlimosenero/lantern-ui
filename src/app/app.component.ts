import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { DataFieldsModalComponent } from './shared/components/data-fields-modal/data-fields-modal.component';
import { StatusCodesModalComponent } from './shared/components/status-codes-modal/status-codes-modal.component';
import { ConsumerAppFormsModalComponent } from './shared/components/consumer-app-forms-modal/consumer-app-forms-modal.component';
import { UpstreamAppFormsModalComponent } from './shared/components/upstream-app-forms-modal/upstream-app-forms-modal.component';
import { VersionFormsModalComponent } from './shared/components/version-forms-modal/version-forms-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ToastComponent, 
    ConfirmationModalComponent, 
    DataFieldsModalComponent,
    StatusCodesModalComponent,
    ConsumerAppFormsModalComponent,
    UpstreamAppFormsModalComponent,
    VersionFormsModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dashboard';
}
