import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy.service';
import { delay, finalize } from 'rxjs';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if( 
    req.url.includes('emailExists') ||
    req.method === 'POST' && req.url.includes('orders')
  )
  {
    return next(req);
  }

  busyService.busy();

  return next(req).pipe(
    finalize(() => busyService.idle()) 
  );
};
