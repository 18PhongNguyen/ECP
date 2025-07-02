import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Order } from '../../shared/models/order';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent {
 order?: Order;
  
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.order = navigation?.extras?.state as Order
  }
}
