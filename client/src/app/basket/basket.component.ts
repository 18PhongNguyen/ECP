import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from '../shared/models/basket';
import { BasketService } from './basket.service';
import { CommonModule } from '@angular/common';
import { OrderTotalsComponent } from '../shared/components/order-totals/order-totals.component';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    OrderTotalsComponent
],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit {
  basket$: Observable<IBasket | null> | undefined;

  constructor(private basketService: BasketService) {}
 
  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  incrementBasketItem(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }

  decrementBasketItem(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }
}
