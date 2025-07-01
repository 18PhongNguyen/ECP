import { Routes } from "@angular/router";

import { authGuard } from "../core/guards/auth.guard";
import { CheckoutSuccessComponent } from "./checkout-success/checkout-success.component";
import { CheckoutComponent } from "./checkout.component";

export const routes: Routes = [
  {path: '', component: CheckoutComponent},
  {path: 'success', component: CheckoutSuccessComponent, canActivate: [authGuard], data: {breadcrumb: 'Success'}},
]

