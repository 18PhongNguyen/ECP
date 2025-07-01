import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Basket, BasketItem } from '../shared/models/basket';
import { BasketService } from './basket.service';
import { CommonModule } from '@angular/common';
import { OrderTotalsComponent } from '../shared/components/order-totals/order-totals.component';
import { BasketSummaryComponent } from "../shared/components/basket-summary/basket-summary.component";

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    OrderTotalsComponent,
    BasketSummaryComponent
],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit {
  basket$: Observable<Basket | null> | undefined;

  constructor(private basketService: BasketService) {}
 
  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  removeBasketItem(item: BasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  incrementBasketItem(item: BasketItem) {
    this.basketService.incrementItemQuantity(item);
  }

  decrementBasketItem(item: BasketItem) {
    this.basketService.decrementItemQuantity(item);
  }
}
