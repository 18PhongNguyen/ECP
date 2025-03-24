import { Component,OnInit } from '@angular/core';
import { CoreModule } from '../core.module';
import { RouterModule } from '@angular/router';
import { BasketService } from '../../basket/basket.service';
import { Observable } from 'rxjs';
import { IBasket } from '../../shared/models/basket';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{
  basket$: Observable<IBasket | null> | undefined;

  constructor(private basketService: BasketService) {}

  ngOnInit() {
      this.basket$ = this.basketService.basket$;
  }
}
