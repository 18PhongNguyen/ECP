import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup<{ email: FormControl<string | null> }>;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.createForgotPasswordForm();
  }

  createForgotPasswordForm() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/)
      ])
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      
      this.accountService.forgotPassword(email!).subscribe({
        next: (response: any) => {
          this.successMessage = response.message || 'If the email exists, a password reset link has been sent.';
          this.forgotPasswordForm.reset();
          this.submitted = false;
        },
        error: (error) => {
          console.error('Forgot password failed', error);
          this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
          this.submitted = false;
        }
      });
    }
  }
}
