import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public router: Router) {
  }
  isLoggedIn = false;
  public token = sessionStorage.getItem('saveToken') || '';
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => this.isLoggedIn = true)
    );
  }

  logout(): void {
    sessionStorage.removeItem('token')
    this.isLoggedIn = false;
    this.router.navigate(['/login/'])

  }
  saveToken(data) {
    sessionStorage.setItem('saveToken',data);
    this.token = sessionStorage.getItem('saveToken');
  }
}