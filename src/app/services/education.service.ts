import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AppConfigService } from '../app-config.service';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
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

  GetEducationList(requestobj): Observable<any> {
    let token = localStorage.getItem('access_token');
    var request = {
      Secret: localStorage.getItem('secret'),
      Token: token,
      Request: requestobj
    }
    return this.http
      .post(this.basePath + 'Education/GetEducationByProfile', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.autService.handleError)
      )
  }
  GetEducationById(requestobj): Observable<any> {
    let token = localStorage.getItem('access_token');
    var request = {
      Secret: localStorage.getItem('secret'),
      Token: token,
      Request: requestobj
    }
    return this.http
      .post(this.basePath + 'Education/GetEducationById', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.autService.handleError)
      )
  }
  DeleteEducation(requestobj): Observable<any> {
    let token = localStorage.getItem('access_token');
    var request = {
      Secret: localStorage.getItem('secret'),
      Token: token,
      Request: requestobj
    }
    return this.http
      .post(this.basePath + 'Education/DeleteEducation', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.autService.handleError)
      )
  }
  UpdateEducation(requestobj): Observable<any> {
    let token = localStorage.getItem('access_token');
    var request = {
      Secret: localStorage.getItem('secret'),
      Token: token,
      Request: requestobj
    }
    return this.http
      .post(this.basePath + 'Education/UpdateEducation', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.autService.handleError)
      )
  }
  AddEducation(requestobj): Observable<any> {
    let token = localStorage.getItem('access_token');
    var request = {
      Secret: localStorage.getItem('secret'),
      Token: token,
      Request: requestobj
    }
    return this.http
      .post(this.basePath + 'Education/AddEducation', request, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.autService.handleError)
      )
  }
}
