import { Component, Input } from '@angular/core';
import { Product } from '../../shared/models/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BasketService } from '../../basket/basket.service';
import { BasketItem } from '../../shared/models/basket';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent{
  @Input() product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    pictureUrl: '',
    productType: '',
    productBrand: ''
  };;

  constructor(private basketService : BasketService) {}
  
  addItemToBasket() {
    this.basketService.addItemToBasket(this.product);
  }
}
