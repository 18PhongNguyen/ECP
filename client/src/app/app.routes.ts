import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    { path: 'shop', loadChildren: () => import('./shop/shop.routes').then(mod => mod.routes) },
    {path: '**', redirectTo: '', pathMatch: 'full'}
];


