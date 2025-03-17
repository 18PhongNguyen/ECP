import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
import { SectionHeaderComponent } from "./core/section-header/section-header.component";
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavBarComponent,
    SectionHeaderComponent,
    NgxSpinnerModule
  ],
  providers: [
    BreadcrumbService
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ECP';

  constructor(private router: Router, private spinner: NgxSpinnerService) {}

  ngOnInit() {
  }
}
