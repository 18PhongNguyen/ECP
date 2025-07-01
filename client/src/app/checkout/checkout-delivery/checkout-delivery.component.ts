import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-checkout-delivery',
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule,
    ReactiveFormsModule,
    CdkStepperNext,
    CdkStepperPrevious
  ],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm?: FormGroup; 
  deliveryMethods?: DeliveryMethod[];

  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit() {
    this.getDeliveryMethods();
  }

  getDeliveryMethods() {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: (methods) => {
        console.log('Delivery methods loaded:', methods);
        this.deliveryMethods = methods;
      },
      error: (error) => {
        console.error('Error fetching delivery methods', error);
      }
    });
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    if (this.checkoutForm) {
      const deliveryForm = this.checkoutForm.get('deliveryForm');
      if (deliveryForm) {
        deliveryForm.get('deliveryMethod')?.setValue(deliveryMethod.id);
        deliveryForm.get('shippingPrice')?.setValue(deliveryMethod.price);
        this.basketService.setShippingPrice(deliveryMethod);
      }
    }
  }

}
