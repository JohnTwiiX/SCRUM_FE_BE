import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss'],
})
export class CreateContactComponent implements OnInit {
  contactForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      badge_color: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.valid) {
      const newContact: Contact = this.contactForm.value;
      this.apiService.createContact(newContact).subscribe({
        next: () => {
          this.successMessage = 'Contact created successfully!';
          this.errorMessage = null;
          this.contactForm.reset();
        },
        error: (error) => {
          this.successMessage = null;
          if (error.status === 400 && error.error.email) {
            this.errorMessage = 'A contact with this email already exists.';
          } else {
            this.errorMessage =
              'There was an error creating the contact. Please try again.';
          }
          console.error('There was an error!', error);
        },
      });
    }
  }
}
