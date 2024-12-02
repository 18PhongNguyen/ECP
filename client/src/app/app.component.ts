import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { response } from 'express';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { IProduct } from './models/product';
import { IPagination } from './models/pagination';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavBarComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent implements OnInit {
  title = 'ECP';
  products: IProduct[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<IPagination>('https://localhost:5001/api/products').subscribe({
      next: (response) => {
        this.products = response.data;
        console.log('Products loaded:', this.products);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      },
      complete: () => {
        console.log('Fetch completed');
        this.loading = false;
      }
    });  
  }
  }

