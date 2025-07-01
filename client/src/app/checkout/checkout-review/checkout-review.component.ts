import { Component, Input } from '@angular/core';
import { BasketSummaryComponent } from "../../shared/components/basket-summary/basket-summary.component";
import { CdkStepper } from '@angular/cdk/stepper';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [BasketSummaryComponent],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss'
})
export class CheckoutReviewComponent {
  @Input() appStepper?: CdkStepper;

  constructor(private basketService: BasketService, private toastr: ToastrService) {}

  createPaymentIntent() {
    this.basketService.createPaymentIntent().subscribe({
      next: (basket) => {
        console.log('Payment intent response:', {
          paymentIntentId: basket.paymentIntentId,
          clientSecret: basket.clientSecret?.substring(0, 20) + '...',
          hasClientSecret: !!basket.clientSecret
        });
        this.appStepper?.next();
      },
      error: (error: any) => {
        this.toastr.error(error.message || 'Failed to create payment intent');
      }
    })
  }
}