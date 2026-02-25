import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private auth = inject(AuthService);

  private readonly ADMIN_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiQWQgTWVhbiIsInJvbGUiOiJBRE1JTiJ9.mrfbumq_NJ1pjNjlIepC6Rrh5hZNPmebpKqh85H6zIU';
  private readonly USER_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5ODc2NTQzMjEiLCJuYW1lIjoiWXUgU2lyIiwicm9sZSI6IlVTRVIifQ.9h5SwHgpPTvycysPH1KFqZUdRTeMgSmM8P_Qak5Cllw';
  
  loginAdmin() {
    console.log('Logging in as Admin...');
    this.auth.login(this.ADMIN_JWT);
  }

  loginUser() {
    console.log('Logging in as User...');
    this.auth.login(this.USER_JWT);
  }
}
