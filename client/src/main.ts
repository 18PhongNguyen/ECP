import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ],
}).catch(err => console.error(err));

//$env:NODE_TLS_REJECT_UNAUTHORIZED=0