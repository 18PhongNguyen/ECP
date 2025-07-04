import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { Product } from '../shared/models/product';
import { DeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;

  constructor(private http: HttpClient) { }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    const bakset = this.getCurrentBasketValue();
    if (bakset) {
      this.shipping = deliveryMethod.price;
      bakset.deliveryMethodId = deliveryMethod.id;
      bakset.shippingPrice = deliveryMethod.price;
      this.setBasket(bakset);
    }
  }


  getBasket(id: string)
  {
    return this.http.get<Basket>(this.baseUrl + 'basket?id=' + id)
    .pipe(
      map((basket: Basket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
        return basket;
      })
    );
  }

  setBasket(basket: Basket) {
    return this.http.post<Basket>(this.baseUrl + 'basket', basket).subscribe({
      next: (response) => {
        this.basketSource.next(response);
        this.calculateTotals();
      },
      error: (error) => {
        console.error('Error setting basket:', error);
      }
    });
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: Product, quantity = 1) {
    const itemToAdd: BasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.getCreateBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: BasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket?.items.findIndex(x => x.id === item.id);
    if (basket && basket.items) {
      if (foundItemIndex !== undefined && foundItemIndex >= 0) {
        basket.items[foundItemIndex].quantity++;
      }
      this.setBasket(basket);
    }
  }

  decrementItemQuantity(item: BasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket?.items.findIndex(x => x.id === item.id);
    if (basket && basket.items) {
      if (foundItemIndex !== undefined && foundItemIndex >= 0) {
        if (basket.items[foundItemIndex].quantity > 1)
        {
          basket.items[foundItemIndex].quantity--;
          this.setBasket(basket);
        }
        else
          this.removeItemFromBasket(item);
      }
    }
  }
  removeItemFromBasketById(id: number, quantity: number) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const item = basket.items.find(x => x.id === id);
      if (item) {
        if (item.quantity > quantity) {
          item.quantity -= quantity;
          this.setBasket(basket);
        } else {
          // If quantity to remove is >= current quantity, remove the whole item
          return this.removeItemFromBasket(item);
        }
      }
    }
  }

  removeItemFromBasket(item: BasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket?.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      }
      else {
        this.deleteBasket(basket);
      }
    }
  }
  deleteBasket(basket: Basket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe({
      next: () => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      },
      error: (error) => {
        console.error('Error deleting basket:', error);
      }
    });
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket?.items.reduce((a,b) => (b.price * b.quantity) + a, 0);
    const total = (subtotal ?? 0) + (basket?.shippingPrice ?? 0);
    this.basketTotalSource.next({shipping: (basket?.shippingPrice ?? 0), total, subtotal: subtotal ?? 0})
  }

 private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number):
 BasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1){
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    else {
      items[index].quantity += quantity;
    }

    return items;
  }
  
  private getCreateBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }
  
  private mapProductItemToBasketItem(item: Product, quantity: number): BasketItem {
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

  clearPaymentIntent() {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      basket.paymentIntentId = undefined;
      basket.clientSecret = undefined;
      this.setBasket(basket);
    }
  }

  createPaymentIntent() {
    return this.http.post<Basket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id, {})
      .pipe(
        map(basket => {
          this.basketSource.next(basket);
          return basket;
        })
      )
  }

  private isProduct(item: Product | BasketItem): item is Product {
    return (item as Product).productBrand !== undefined;
  }
}

