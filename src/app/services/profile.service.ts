import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AppConfigService } from '../app-config.service';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  secret = '';
  basePath = '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient, private autService:
    AuthService, private configservice: AppConfigService) {
    this.basePath = this.configservice.getConfig('BASE_URL');
    this.secret = this.configservice.getConfig('Secret');
  }
  GetProfile(requestobj): Observable<any> {
    let token = localStorage.getItem('access_token');
    var request = {
      Secret: localStorage.getItem('secret'),
      Token: token,
      Request: requestobj
    }
    return this.http
      .post(this.basePath + 'Profile/GetProfile', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.autService.handleError)
      )
  }
  DeleteProfile(requestobj): Observable<any> {
    let token = localStorage.getItem('access_token');
    var request = {
      Secret: localStorage.getItem('secret'),
      Token: token,
      Request: requestobj
    }
    return this.http
      .post(this.basePath + 'Profile/DeleteProfile', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.autService.handleError)
      )
  }
  UpdateProfile(requestobj): Observable<any> {
    let token = localStorage.getItem('access_token');
    var request = {
      Secret: localStorage.getItem('secret'),
      Token: token,
      Request: requestobj
    }
    return this.http
      .post(this.basePath + 'Profile/UpdateProfile', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.autService.handleError)
      )
  }
}
