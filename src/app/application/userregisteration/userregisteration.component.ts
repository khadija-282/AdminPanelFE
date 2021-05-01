import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserregistrationService } from 'src/app/services/userregistration.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-userregisteration',
  templateUrl: './userregisteration.component.html',
  styleUrls: ['./userregisteration.component.css']
})
export class UserregisterationComponent implements OnInit {
  isShowPassword = false;


  form = new FormGroup({
    Email: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    Password: new FormControl('', Validators.required),
    RepeatPassword: new FormControl('', Validators.required)
  });
  constructor(private userservice: UserregistrationService, private spinner: NgxSpinnerService,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    if (this.getParamValueQueryString('isShowPassword') != undefined) {
      this.isShowPassword = this.getParamValueQueryString('isShowPassword');
    }
  }
  getControl(name) {
    return this.form.get(name);
  }

  onSubmit() {
    this.spinner.show();
    this.userservice.AddUser(this.form.value).subscribe((res: any) => {
      console.log(res);
      if (res.Result) {
        this.toastr.success('Yay!', 'You have been registered');
        this.router.navigate(['/login']);
      } else {
        this.toastr.error('Error', 'Unable to register you');
      }
      this.spinner.hide();
    });
  }
  getParamValueQueryString(paramName) {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }


}
