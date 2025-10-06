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
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(mod => mod.ForgotPasswordComponent),
    data: { breadcrum: "Forgot Password" }
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component').then(mod => mod.ResetPasswordComponent),
    data: { breadcrum: "Reset Password" }
  }
];