import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-paging-header',
  standalone: true,
  imports: [
    CommonModule,
    PaginationModule
  ],
  templateUrl: './paging-header.component.html',
  styleUrl: './paging-header.component.scss'
})
export class PagingHeaderComponent implements OnInit{
  @Input() pageNumber: number = 1;
  @Input() pageSize: number = 6;
  @Input() totalCount: number = 0;
  
  ngOnInit(): void {
    
  }
}
