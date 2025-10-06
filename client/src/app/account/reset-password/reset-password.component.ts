import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent,
    RouterModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  email: string = '';
  token: string = '';
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private accountService: AccountService, 
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get email and token from query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
      
      // Debug: Log để kiểm tra token
      console.log('Email:', this.email);
      console.log('Token received:', this.token);
      console.log('Token length:', this.token.length);
      
      if (!this.email || !this.token) {
        this.errorMessage = 'Invalid reset password link.';
      }
    });

    this.createResetPasswordForm();
  }

  createResetPasswordForm() {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,50}$/)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator() });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const newPassword = control.get('newPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return newPassword === confirmPassword ? null : { mismatch: true };
    };
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetPasswordForm.valid && this.email && this.token) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      
      this.accountService.resetPassword(this.email, this.token, newPassword).subscribe({
        next: (response: any) => {
          this.successMessage = response.message || 'Password has been reset successfully!';
          this.resetPasswordForm.reset();
          this.submitted = false;
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigateByUrl('/account/login');
          }, 3000);
        },
        error: (error) => {
          console.error('Reset password failed', error);
          if (error.error?.errors) {
            this.errorMessage = error.error.errors.join(', ');
          } else {
            this.errorMessage = error.error?.message || 'Failed to reset password. The link may have expired.';
          }
          this.submitted = false;
        }
      });
    }
  }

  get passwordsMatch(): boolean {
    return !this.resetPasswordForm.hasError('mismatch');
  }
}
