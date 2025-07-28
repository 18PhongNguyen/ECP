import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Brand } from '../shared/models/brands';
import { Type } from '../shared/models/types';
import { Observable } from 'rxjs';
import { ShopParams } from '../shared/models/shopParams';
import { map } from 'rxjs/operators';
import { Product } from '../shared/models/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get products with filtering, sorting, and pagination
  getProducts(shopParams: ShopParams): Observable<Pagination> {
    let params = new HttpParams();

    if (shopParams.brandId !== 0) {
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId !== 0) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    // Add other parameters for sorting and pagination
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    return this.http.get<Pagination>(`${this.baseUrl}products`, { params })
      .pipe(
        map(response => response) 
      );
  }


  getProduct(id: number): Observable<Product>{
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}products/brands`);
  }

  getTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.baseUrl}products/types`);
  }
}
