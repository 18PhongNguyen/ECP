import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Address } from '../../shared/models/address';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { BasketService } from '../../basket/basket.service';
import { Basket } from '../../shared/models/basket';
import { OrderToCreate } from '../../shared/models/order';
import { CheckoutService } from '../checkout.service';
import { Stripe, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement, loadStripe } from '@stripe/stripe-js';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [
    TextInputComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() checkoutForm?: FormGroup;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;
  cardErrors: any;
  loading = false;
  private initRetryCount = 0;
  private maxRetries = 20; 

  constructor(private basketService: BasketService, private checkoutService: CheckoutService, 
      private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeStripe();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkoutForm'] && changes['checkoutForm'].currentValue && !this.stripe) {
      this.initRetryCount = 0;
      setTimeout(() => this.initializeStripe(), 100);
    }
  }

  private initializeStripe(): void {
    if (!this.checkoutForm) {
      if (this.initRetryCount < this.maxRetries) {
        this.initRetryCount++;
        setTimeout(() => this.initializeStripe(), 100);
      }
      return;
    }

    if (!this.cardNumberElement?.nativeElement || 
        !this.cardExpiryElement?.nativeElement || 
        !this.cardCvcElement?.nativeElement) {
      if (this.initRetryCount < this.maxRetries) {
        this.initRetryCount++;
        setTimeout(() => this.initializeStripe(), 100);
      }
      return;
    }

    this.initRetryCount = 0;

    const cardNumberEl = this.cardNumberElement!.nativeElement;
    const cardExpiryEl = this.cardExpiryElement!.nativeElement;
    const cardCvcEl = this.cardCvcElement!.nativeElement;

    const cardNumberContainer = cardNumberEl.parentElement;
    const cardExpiryContainer = cardExpiryEl.parentElement;
    const cardCvcContainer = cardCvcEl.parentElement;

    this.clearElementContent(cardNumberEl);
    this.clearElementContent(cardExpiryEl);
    this.clearElementContent(cardCvcEl);

    cardNumberEl.removeAttribute('class');
    cardExpiryEl.removeAttribute('class');
    cardCvcEl.removeAttribute('class');

    loadStripe(environment.stripePublishableKey).then((stripe: any) => {
      this.stripe = stripe;
      const elements = stripe?.elements();
      if (elements) {
        const style = {
          base: {
            fontSize: '16px',
            color: '#495057',
            fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            '::placeholder': {
              color: '#6c757d',
            },
          },
          invalid: {
            color: '#dc3545',
          },
        };

        this.cardNumber = elements.create('cardNumber', { style });
        if (this.cardNumber) {
          this.cardNumber.mount(cardNumberEl);
          this.cardNumber.on('change', (event: any) => {
            this.cardNumberComplete = event.complete;
            if (event.error) {
              this.cardErrors = event.error.message;
              cardNumberContainer?.classList.add('has-error');
              cardNumberContainer?.classList.remove('is-complete');
            } else {
              this.cardErrors = null;
              cardNumberContainer?.classList.remove('has-error');
              if (event.complete) {
                cardNumberContainer?.classList.add('is-complete');
              } else {
                cardNumberContainer?.classList.remove('is-complete');
              }
            }
          })
        }

        this.cardExpiry = elements.create('cardExpiry', { style });
        if (this.cardExpiry) {
          this.cardExpiry.mount(cardExpiryEl);
          this.cardExpiry.on('change', (event: any) => {
            this.cardExpiryComplete = event.complete;
            if (event.error) {
              this.cardErrors = event.error.message;
              cardExpiryContainer?.classList.add('has-error');
              cardExpiryContainer?.classList.remove('is-complete');
            } else {
              this.cardErrors = null;
              cardExpiryContainer?.classList.remove('has-error');
              if (event.complete) {
                cardExpiryContainer?.classList.add('is-complete');
              } else {
                cardExpiryContainer?.classList.remove('is-complete');
              }
            }
          })
        }

        this.cardCvc = elements.create('cardCvc', { style });
        if (this.cardCvc) {
          this.cardCvc.mount(cardCvcEl);
          this.cardCvc.on('change', (event: any) => {
            this.cardCvcComplete = event.complete;
            if (event.error) {
              this.cardErrors = event.error.message;
              cardCvcContainer?.classList.add('has-error');
              cardCvcContainer?.classList.remove('is-complete');
            } else {
              this.cardErrors = null;
              cardCvcContainer?.classList.remove('has-error');
              if (event.complete) {
                cardCvcContainer?.classList.add('is-complete');
              } else {
                cardCvcContainer?.classList.remove('is-complete');
              }
            }
          })
        }

      }
    }).catch((error: any) => {
      console.error('Error loading Stripe:', error);
    });
  }

  private clearElementContent(element: HTMLElement): void {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    element.textContent = '';
    element.innerHTML = '';
  }

  get paymentFormComplete() {
    return this.checkoutForm?.get('paymentForm')?.valid 
      && this.cardNumberComplete 
      && this.cardExpiryComplete 
      && this.cardCvcComplete
  }

  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) throw new Error('cannot get basket');
    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);
      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = {state: createdOrder};
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.toastr.error(paymentResult.error.message);
      }
    } catch (error: any) {
      console.log(error);
      this.toastr.error(error.message)
    } finally {
      this.loading = false;
    }
  }

  private async confirmPaymentWithStripe(basket: Basket | null) {
    if (!basket) throw new Error('Basket is null');
    if (!basket.clientSecret) throw new Error('No client secret available');
    
    console.log('Confirming payment with:', {
      paymentIntentId: basket.paymentIntentId,
      clientSecret: basket.clientSecret?.substring(0, 20) + '...'
    });
    
    const result = this.stripe?.confirmCardPayment(basket.clientSecret!, {
      payment_method: {
        card: this.cardNumber!,
        billing_details: {
          name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    });
    if (!result) throw new Error('Problem attempting payment with stripe');
    return result;
  }

  private async createOrder(basket: Basket | null) {
    if (!basket) throw new Error('Basket is null');
    const orderToCreate = this.getOrderToCreate(basket);
    return firstValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  private getOrderToCreate(basket: Basket): OrderToCreate {
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
    if (!deliveryMethodId || !shipToAddress) throw new Error('Problem with basket');
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }
}
