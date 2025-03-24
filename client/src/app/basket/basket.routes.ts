import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./basket.component').then(mod => mod.BasketComponent)
  },
  // {
  //   path: ':id',
  //   loadComponent: () =>
  //     import('./product-details/product-details.component').then(mod => mod.ProductDetailsComponent),
  //   data: {breadcrumb: {alias: 'productDetails'}} 
  // }
];