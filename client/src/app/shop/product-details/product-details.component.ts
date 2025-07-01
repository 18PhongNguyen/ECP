import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from '../../basket/basket.service';
import { BasketItem } from '../../shared/models/basket';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  providers: [ShopService],
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined
  quantity = 1;
  constructor(
    private shopService: ShopService,
    private activateRoute: ActivatedRoute, 
    private bcService: BreadcrumbService,
    private basketService: BasketService) {
    this.bcService.set('@productDetails', ' ');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (id) {
      this.shopService.getProduct(+id).subscribe({
        next: (product) => {
          this.product = product;
          this.bcService.set('@productDetails', product.name);
        },
        error: (err) => {
          console.error('Error fetching products:', err);
        },
        complete: () => {
          console.log('Fetch completed');
        },
      });
    }
  }

  addItemToBasket() {
    if (this.product) {
      this.basketService.addItemToBasket(this.product, this.quantity);
    }
  }

  incrementQuantity() {
    this.quantity++;
  }
  
  decrementQuantity() {
    if (this.quantity > 1)
      this.quantity--;
  }
  
  mapProductItemToBasketItem(item: Product, quantity: number): BasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: quantity,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    };
  }
}
