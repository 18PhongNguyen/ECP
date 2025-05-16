import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(mod => mod.LoginComponent),
    data: { breadcrum: "Login" }
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(mod => mod.RegisterComponent),
    data: { breadcrum: "Register" }
  }
];