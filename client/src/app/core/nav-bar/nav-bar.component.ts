import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasketService } from '../../basket/basket.service';
import { Observable } from 'rxjs';
import { Basket } from '../../shared/models/basket';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user';
import { AccountService } from '../../account/account.service';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    BsDropdownModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  providers: [
    { provide: BsDropdownConfig }
  ]
})
export class NavBarComponent implements OnInit{
  basket$: Observable<Basket | null> | undefined;
  currentUser$: Observable<User| null> | undefined;

  constructor(private basketService: BasketService, private accountService: AccountService) {}

  ngOnInit() {
      this.basket$ = this.basketService.basket$;
      this.currentUser$ = this.accountService.currentUser$;
  }

  logout() {
    this.accountService.logout();
  }
}
