import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shop.component').then(mod => mod.ShopComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-details/product-details.component').then(mod => mod.ProductDetailsComponent),
    data: {breadcrumb: {alias: 'productDetails'}} 
  }
];