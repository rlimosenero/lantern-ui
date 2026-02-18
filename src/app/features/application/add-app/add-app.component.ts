import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatCheckboxModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatDividerModule
  ],
  templateUrl: './add-app.component.html',
  styleUrls: ['./add-app.component.scss']
})
export class AddAppComponent {
  
  // Distinct Signals for each category
  platforms = signal(['Kubernetes', 'Containerized', 'Serverless', 'Virtual Machine', 'Bare Metal', 'Edge Computing']);
  stacks = signal(['Java Spring Boot', 'Node.js Express', 'Python Django', 'React', 'Angular', 'Vue.js', 'Go', '.NET Core']);
  storages = signal(['PostgreSQL', 'MongoDB', 'Redis', 'S3 Bucket', 'Elasticsearch', 'DynamoDB', 'SQL Server', 'Oracle']);
  securities = signal(['OAuth2', 'JWT', 'SAML', 'HTTPS/TLS', 'API Gateway', 'Vault', 'SonarQube', 'Checkmarx']);

  appForm = new FormGroup({
    // Basic Information
    name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    version: new FormControl('', Validators.required),
    status: new FormControl('Active'),
    serviceType: new FormControl('API'),

    // Ownership
    ownerName: new FormControl('', Validators.required),
    ownerDept: new FormControl('', Validators.required),
    bauSupportName: new FormControl('', Validators.required),
    bauSupportDept: new FormControl('', Validators.required),

    // Application URLs
    gitRepoUrl: new FormControl(''),
    swaggerUrl: new FormControl(''),
    documentsUrl: new FormControl(''),

    // Version Info
    releaseStage: new FormControl('STABLE'),
    environment: new FormControl('PROD'),
    appVersion: new FormControl(''),
    buildVersion: new FormControl(''),
    features: new FormControl(''),
    developers: new FormControl(''),
    squadName: new FormControl(''),

    // Separate FormArrays for Storage and Security
    selectedPlatforms: new FormArray([]),
    selectedStacks: new FormArray([]),
    selectedStorage: new FormArray([]),
    selectedSecurity: new FormArray([])
  });

  toggleSelection(event: MatCheckboxChange, arrayName: string) {
    const formArray = this.appForm.get(arrayName) as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.source.value);
      if (index !== -1) formArray.removeAt(index);
    }
  }
}