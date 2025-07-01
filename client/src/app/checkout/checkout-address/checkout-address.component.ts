import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../account/account.service';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CdkStepperNext } from '@angular/cdk/stepper';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [
    SharedModule,
    TextInputComponent,
    CommonModule,
    ReactiveFormsModule,
    CdkStepperNext,
    RouterLink
  ],
  templateUrl: './checkout-address.component.html',
  styleUrl: './checkout-address.component.scss'
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm?: FormGroup;

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder) {}
  ngOnInit() { }

  saveUserAddress() {
    this.accountService.updateUserAddress(this.checkoutForm?.get('addressForm')?.value).subscribe({
      next: () => {
        this.toastr.success('Address saved');
        this.checkoutForm?.get('addressForm')?.reset(this.checkoutForm?.get('addressForm')?.value);
      },
      error: (err) => {
        console.error('Error saving address:', err);
        this.toastr.error(err.message || 'Failed to save address');
      }
    })
  }
}
