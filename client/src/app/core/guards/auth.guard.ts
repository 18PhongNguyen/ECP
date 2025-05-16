import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AccountService } from '../../account/account.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/account/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }

  if (accountService.currentUser$) {
    return true;
  }

  return accountService.loadCurrentUser(token).pipe(
    map(user => {
      if (!user) throw new Error('Invalid user');
      return true;
    }),
    catchError(err => {
      localStorage.removeItem('token');
      router.navigate(['/account/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return of(false);
    })
  );
};