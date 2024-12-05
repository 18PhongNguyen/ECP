import { Component,OnInit } from '@angular/core';
import { CoreModule } from '../core.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CoreModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{
  constructor() {}

  ngOnInit() {
      
  }
}
