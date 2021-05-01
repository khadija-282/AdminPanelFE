import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    Email: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    Password: new FormControl('', Validators.required)
  });
  constructor(private toastr: ToastrService, private authService: AuthService, private profileservice: ProfileService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    let user = localStorage.getItem('user');
    console.log('User at login', user);
    if (user != undefined) {
      let token = localStorage.getItem('access_token');
      this.authService.validateToken().subscribe((res: any) => {
        if (res != undefined) {
          this.authService.routeUser();
        }
        this.spinner.hide();
      });
    }
  }
  login() {
    this.spinner.show();
    console.log(this.form.value);
    this.authService.loginForm(this.form.value).subscribe((res: any) => {
      console.log(res);
      if (res != undefined) {
        console.log(res);
        localStorage.setItem('access_token', res.Token);
        localStorage.setItem('secret', res.Secret);
        let profile = { Id: 0, FullName: '', FatherName: '', NIC: 0, Address: '', Gender: '', Email: this.form.get('Email').value, MobileNumber: 0 }
        this.profileservice.GetProfile(profile).subscribe((res: any) => {
          if (res.Result) {
            this.authService.setUser(res);
          }
          else {
            this.toastr.error('We couldnt find a profile against your email and password');
          }
          this.spinner.hide();
        });
      } else {
        console.log('Cannot Login');
        this.toastr.error('Email or password incorrect!');
      }
    });
  }
  getEmail() {
    return this.form.get('Email');
  }

  getPassword() {
    return this.form.get('Password');
  }
}
