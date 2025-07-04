import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}},
    {path: 'test-error', component: TestErrorComponent, data: {breadcrumb: 'Test Errors'}},
    {path: 'server-error', component: ServerErrorComponent, data: {breadcrumb: 'Server Errors'}},
    {path: 'not-found', component: NotFoundComponent, data: {breadcrumb: 'Not Found'}},
    {path: 'shop', loadChildren: () => import('./shop/shop.routes').then(mod => mod.routes), 
    data: {breadcrumb: 'Shop'}},
    {path: 'basket', loadChildren: () => import('./basket/basket.routes').then(mod => 
        mod.routes), data: {breadcrumb: 'Basket'}},
    {path: 'checkout', canActivate:[authGuard], loadChildren: () => import('./checkout/checkout.routes').then(mod => 
        mod.routes), data: {breadcrumb: 'Checkout'}},
    {path: 'orders', canActivate:[authGuard], loadChildren: () => import('./orders/orders.routes').then(mod => 
            mod.routes), data: {breadcrumb: 'Orders'}},
    {path: 'account', loadChildren: () => import('./account/account.routes').then(mod => 
        mod.routes), data: {breadcrumb: {skip: true}}},
    {path: '**', redirectTo: 'not-found', pathMatch: 'full'}
];


