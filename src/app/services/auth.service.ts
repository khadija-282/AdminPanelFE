import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppConfigService } from '../app-config.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  basePath = '';
  public secret = "";
  constructor(private router: Router, private configservice: AppConfigService, private toastr: ToastrService,
    private http: HttpClient) {
    this.basePath = this.configservice.getConfig('BASE_URL');
    this.secret = this.configservice.getConfig('Secret');
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error.message);
      this.toastr.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      let r = `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`;
      console.log(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      this.toastr.error(r);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
  // Verify user credentials on server to get token
  loginForm(data): Observable<any> {
    console.log(this.basePath);
    var request = {
      Secret: this.secret,
      Request: data
    }
    return this.http
      .post<any>(this.basePath + 'User/Login', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
  validateToken(): Observable<any> {
    let token = localStorage.getItem('access_token');
    console.log(this.basePath);
    var request = {
      Secret: this.secret,
      Request: null,
      Token: token
    }
    return this.http
      .post<any>(this.basePath + 'Base/ValidateToken', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
  routeUser() {
    this.router.navigate(['/dashboard']);
  }
  // After login save token and other values(if any) in localStorage
  setUser(resp: any) {
    localStorage.setItem('user', JSON.stringify(resp.Result));
    localStorage.setItem('access_token', resp.Token);
    localStorage.setItem('secret', resp.Secret);
    this.router.navigate(['/dashboard']);
  }

  // Checking if token is set
  isLoggedIn() {
    return localStorage.getItem('access_token') != null;
  }

  // After clearing localStorage redirect to login screen
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
