import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { sharedProviders } from '../shared/shared.providers';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule
  ],
  providers: [
   
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
