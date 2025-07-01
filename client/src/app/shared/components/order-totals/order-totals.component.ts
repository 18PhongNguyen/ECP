import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketTotals } from '../../models/basket';
import { BasketService } from '../../../basket/basket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-totals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-totals.component.html',
  styleUrl: './order-totals.component.scss'
})
export class OrderTotalsComponent implements OnInit{
  basketTotal$: Observable<BasketTotals | null> | undefined;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
      this.basketTotal$ = this.basketService.basketTotal$;
  }
}
