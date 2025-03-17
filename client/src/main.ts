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
import { importProvidersFrom } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { sharedProviders } from './app/shared/shared.providers';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([ErrorInterceptor, LoadingInterceptor])
    ),
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    provideNoopAnimations(),
    BreadcrumbService,
    importProvidersFrom(CarouselModule.forRoot()),
    sharedProviders
  ],
}).catch(err => console.error(err));
