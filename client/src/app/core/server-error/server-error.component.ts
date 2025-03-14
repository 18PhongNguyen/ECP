import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, Navigation } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent {
  error: { message?: string; details?: string } | null = null;

  constructor(private router: Router) {
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    const errorData = navigation?.extras?.state?.['error'];
  }
}
