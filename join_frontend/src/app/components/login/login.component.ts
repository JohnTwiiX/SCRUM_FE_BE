import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  feedbackMessage: string | null = null;
  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(
        (data) => {
          localStorage.setItem('token', data.token);
          this.apiService.loggedInStatus = true;
          this.feedbackMessage = 'You are logged in';
          this.isError = false;

          setTimeout(() => {
            this.router.navigate(['/board']);
          }, 2000); // Redirect after 2 seconds
        },
        (error) => {
          this.feedbackMessage = 'Something went wrong, try again';
          this.isError = true;
          console.error('Login error', error);
        }
      );
    }
  }
}
