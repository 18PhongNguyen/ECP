import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy.service';
import { delay, finalize } from 'rxjs';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if(!req.url.includes('emailexists'))
  {
    busyService.busy();
  }

  return next(req).pipe(
    delay(500), 
    finalize(() => busyService.idle()) 
  );
};
