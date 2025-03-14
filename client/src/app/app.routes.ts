import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { TestErrorComponent } from './core/test-error/test-error.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'test-error', component: TestErrorComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'shop', loadChildren: () => import('./shop/shop.routes').then(mod => mod.routes) },
    {path: '**', redirectTo: 'not-found', pathMatch: 'full'}
];


