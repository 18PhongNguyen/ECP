import { Routes } from "@angular/router";
import { CheckoutComponent } from "./checkout.component";
import { authGuard } from "../core/guards/auth.guard";

export const routes: Routes = [
  {path: '', component: CheckoutComponent}
]

