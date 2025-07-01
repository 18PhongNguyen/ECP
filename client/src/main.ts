import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { LoadingInterceptor } from './app/core/interceptors/loading.interceptors'; 
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app/app.routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { BreadcrumbService } from 'xng-breadcrumb';
import { sharedProviders } from './app/shared/shared.providers';
import { JwtInterceptor } from './app/core/interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        ErrorInterceptor,
        LoadingInterceptor,
        JwtInterceptor
      ])
    ),
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    provideNoopAnimations(),
    BreadcrumbService,
    sharedProviders
  ],
}).catch(err => console.error(err));

//set NODE_TLS_REJECT_UNAUTHORIZED=0
//ng serve --ssl