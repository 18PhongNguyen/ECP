import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { OrderTotalsComponent } from "../shared/components/order-totals/order-totals.component";
import { StepperComponent } from '../shared/components/stepper/stepper.component';
import { SharedModule } from '../shared/shared.module';
import { CheckoutAddressComponent } from "./checkout-address/checkout-address.component";
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { CheckoutPaymentComponent } from "./checkout-payment/checkout-payment.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkStep } from '@angular/cdk/stepper';
import { AccountService } from '../account/account.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    PaginationModule,
    OrderTotalsComponent,
    StepperComponent,
    SharedModule,
    CheckoutAddressComponent,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CheckoutPaymentComponent,
    ReactiveFormsModule,
    CdkStep
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;

  constructor(private fb: FormBuilder, private accountService: AccountService) {}

  ngOnInit() {
    this.createCheckoutForm();
    this.getAddressFormValues();
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipcode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required],
        shippingPrice: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required],
      })
    })
  }

  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe({
      next: (address) => { 
        if (address) {
          this.checkoutForm.get('addressForm')?.patchValue({
            firstName: address.firstName,
            lastName: address.lastName,
            street: address.street,
            city: address.city,
            state: address.state,
            zipcode: address.zipcode
          });
        }
      },
      error: (error) => {
        console.error('Error fetching address', error);
      }
    });  
  }
}
