import { Routes } from "@angular/router";
import { OrdersComponent } from "./orders.component";
import { OrderDetailedComponent } from "./order-detailed/order-detailed.component";

export const routes: Routes = [
    {path: '', component: OrdersComponent},
    {path: ':id', component: OrderDetailedComponent, data: {breadcrumb: {alias: 'orderDetails'}}},
];