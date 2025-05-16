import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { debounceTime, distinctUntilChanged, first, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

const EMAIL_PATTERN = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,50}$/;
const DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup | undefined;
  errors: string[] | undefined;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private accountService: AccountService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.createRegisterForm();
  }
  
  createRegisterForm(): void {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: [
        '', 
        [
          Validators.required, 
          Validators.pattern(EMAIL_PATTERN)
        ],
        [this.validateEmailNotTaken()]
      ],
      password: [
        '',
        [
          Validators.required, 
          Validators.pattern(PASSWORD_PATTERN)
        ]
      ]
    });
  }

  onSubmit(): void {
    if (this.registerForm?.invalid) {
      this.registerForm?.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errors = undefined;

    this.accountService.register(this.registerForm?.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/shop');
      },
      error: (err) => {
        this.isLoading = false;
        this.errors = err.errors || ['An unexpected error occurred'];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validateEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value || control.errors?.['pattern']) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        switchMap(value => 
          this.accountService.checkEmailExists(value).pipe(
            map(exists => exists ? { emailExists: true } : null)
          )
        ),
        first()
      );
    };
  }
}