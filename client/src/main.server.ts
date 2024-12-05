import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import {routes} from './app/app.routes';


// This is for SSR specific configuration
export default function bootstrap() {
    return bootstrapApplication(AppComponent, {
      providers: [
        provideRouter(routes),
        provideHttpClient(withFetch())
      ],
    });
}
