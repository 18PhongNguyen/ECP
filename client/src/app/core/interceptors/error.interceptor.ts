import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationExtras } from '@angular/router';
import { catchError, delay, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        if (error.status === 400) {
          if (error.error?.errors) {
            return throwError(() => error.error);
          } else {
            toastr.error(error.error?.message, `Lỗi ${error.status}`);
          }
        }
        if (error.status === 401) {
          toastr.error(error.error?.message, `Lỗi ${error.status}`);
        }
        if (error.status === 404) {
          router.navigateByUrl('/not-found');
        }
        if (error.status === 500) {
          const navigationExtras: NavigationExtras = { state: { error: error.error } };
          router.navigateByUrl('/server-error', navigationExtras);
        }
      }
      return throwError(() => error);
    })
  );
};
