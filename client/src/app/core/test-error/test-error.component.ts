import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ErrorInterceptor } from '../interceptors/error.interceptor';
import { error } from 'console';

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss',
})
export class TestErrorComponent implements OnInit {
  constructor(private http: HttpClient) {}
  baseUrl = environment.apiUrl;
  validationErrors: any

  ngOnInit(): void {}

  get404Error() {
    this.http.get(this.baseUrl + 'products/42').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

    get500Error() {
      this.http.get(this.baseUrl + 'buggy/servererror').subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

    get400ValidationError() {
      this.http.get(this.baseUrl + 'products/fortytwo').subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
          this.validationErrors = err.errors;
        },
      });
    }

}
