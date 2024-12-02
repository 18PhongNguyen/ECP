import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';

// This is for SSR specific configuration
export default function bootstrap() {
    return bootstrapApplication(AppComponent, {
      providers: [provideHttpClient(withFetch())],
    });
}
