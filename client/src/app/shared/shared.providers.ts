import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';

export const sharedProviders = [          
  provideHttpClient(),      
  importProvidersFrom(PaginationModule.forRoot()),
  provideNoopAnimations(),
]
