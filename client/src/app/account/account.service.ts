import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of, ReplaySubject } from 'rxjs';
import { User } from '../shared/models/user';
import { Router } from '@angular/router';
import { Address } from '../shared/models/address';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User|null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { 
  }


  loadCurrentUser(token: string):Observable<User|null> {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(this.baseUrl + 'account', { headers }).pipe(
      map((user: User) => {
        this.setCurrentUser(user);
        localStorage.setItem('token', user.token);
        return user;
      })
    );
  }

  login(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', values).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getCurrentUser() {
    return this.currentUserSource.asObservable();
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  getUserAddress() {
    return this.http.get<Address>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: Address) {
    return this.http.put(this.baseUrl + 'account/address', address);
  }

  forgotPassword(email: string) {
    return this.http.post(this.baseUrl + 'account/forgotpassword', { email });
  }

  resetPassword(email: string, token: string, newPassword: string) {
    return this.http.post(this.baseUrl + 'account/resetpassword', { 
      email, 
      token, 
      newPassword 
    });
  }
}
