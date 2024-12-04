import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { ShopComponent } from "./shop/shop.component";
import { ShopModule } from './shop/shop.module';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CoreModule,
    ShopComponent,
    ShopModule
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent implements OnInit {
  title = 'ECP';

  constructor() {}

  ngOnInit(): void {
  }
  }

