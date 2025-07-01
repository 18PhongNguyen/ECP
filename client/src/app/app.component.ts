import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
import { SectionHeaderComponent } from "./core/section-header/section-header.component";
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';
import { User } from './shared/models/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    SectionHeaderComponent,
    NgxSpinnerModule,
    RouterModule,
  ],
  providers: [
    BreadcrumbService,
    AccountService,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ECP';

  constructor(private router: Router, private spinner: NgxSpinnerService,
    private basketService: BasketService, private accountService: AccountService) {}

  ngOnInit() {
    this.loadBasket();
    this.loadCurrentUser();
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe({
        next: () => {
          console.log('initialised basket');
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  loadCurrentUser() {
  const token = localStorage.getItem('token');

    if (token) {
        this.accountService.loadCurrentUser(token).subscribe({
          next: (user: User | null) => {
            console.log('Initialised user from local storage',user);
          },
          error: (err: any) => {
            console.error('Error loading user:', err);
          }
        });
    } 
  else {
      console.log('No token found');
  }
}
}