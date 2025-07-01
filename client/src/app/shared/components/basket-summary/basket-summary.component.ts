import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasketService } from '../../../basket/basket.service';
import { BasketItem } from '../../models/basket';
import { RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-basket-summary',
  standalone: true,
  imports: [
    RouterModule,
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './basket-summary.component.html',
  styleUrl: './basket-summary.component.scss'
})
export class BasketSummaryComponent {
  @Output() addItem = new EventEmitter<BasketItem>();
  @Output() removeItem = new EventEmitter<{id: number, quantity: number}>();
  @Input() isBasket = true;

  constructor(public basketService: BasketService) {}

  addBasketItem(item: BasketItem) {
    this.addItem.emit(item)
  }

  removeBasketItem(id: number, quantity = 1) {
    this.removeItem.emit({id, quantity})
  }
}