import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfigService } from '../app-config.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { retry, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserregistrationService {
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
  AddUser(requestobj): Observable<any> {
    let token = localStorage.getItem('access_token');
    let email = { body: "Please click the link to verify the account", subject: "Verify User Account" };
    let secret = this.configservice.getConfig('Secret')
    var request = {
      Secret: secret,
      Token: token,
      Request: { User: requestobj, Email: email }
    }
    return this.http
      .post(this.basePath + 'User/Register', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.autService.handleError)
      )
  }
}
