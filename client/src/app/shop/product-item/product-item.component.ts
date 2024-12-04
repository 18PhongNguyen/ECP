import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent implements OnInit{
  @Input() product: IProduct = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    pictureUrl: '',
    productType: '',
    productBrand: ''
  };;
  
  ngOnInit(): void {

  }
}