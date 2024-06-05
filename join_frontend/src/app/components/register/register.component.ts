import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  feedbackMessage: string | null = null;
  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.apiService.register({ username, email, password }).subscribe(
        (data) => {
          this.feedbackMessage = 'User created successfully';
          this.isError = false;

          localStorage.setItem('token', data.token);
          setTimeout(() => {
            this.router.navigate(['/board']);
          }, 2000); // Redirect after 2 seconds
        },
        (error) => {
          this.feedbackMessage = 'Something went wrong, please try again';
          this.isError = true;
          console.error('Registration error', error);
        }
      );
    }
  }
}
