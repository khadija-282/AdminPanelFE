import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { AppConfigService } from 'src/app/app-config.service';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @HostBinding('class') classes = 'main-content-inner';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  form = new FormGroup({
    Id: new FormControl(0),
    FullName: new FormControl('', Validators.required),
    FatherName: new FormControl('', Validators.required),
    Address: new FormControl('', Validators.required),
    Gender: new FormControl('', Validators.required),
    Email: new FormControl(''),
    MobileNumber: new FormControl(0, [Validators.required]),
    NIC: new FormControl(0, [Validators.required])
  });
  //, Validators.pattern("/\\d{5}-\\d{7}-\\d/")
  //Validators.pattern("^((\\+92)|(0092))-{0,1}\\d{3}-{0,1}\\d{7}$|^\\d{11}$|^\\d{4}-\\d{7}$")
  constructor(private profileservice: ProfileService, private authService: AuthService, private spinner: NgxSpinnerService,
    private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    let token = localStorage.getItem('access_token');
    if (user == undefined || token == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.form.get('Email').patchValue(user.Email);
      this.onLoad();
    }
  }
  getControl(name) {
    return this.form.get(name);
  }
  onLoad() {
    this.spinner.show();
    this.profileservice.GetProfile(JSON.stringify(this.form.value)).subscribe((res: any) => {
      console.log(res);
      if (res == null || res == undefined) {
        this.router.navigate(['/login']);
        return;
      }
      if (res.Result) {
        this.toastr.success('Yay!', 'We found your profile!');
        this.getControl('Id').patchValue(res.Result.Id);
        this.getControl('FullName').patchValue(res.Result.FullName);
        this.getControl('FatherName').patchValue(res.Result.FatherName);
        this.getControl('NIC').patchValue(res.Result.NIC);
        this.getControl('Address').patchValue(res.Result.Address);
        this.getControl('Gender').patchValue(res.Result.Gender.toString().trim());
        this.getControl('MobileNumber').patchValue(res.Result.MobileNumber);
      } else {
        this.toastr.error('Error', 'Sorry we couldnt update the profile at this moment');
      }
      this.spinner.hide();
    });
  }
  onDelete() {
    this.spinner.show();
    this.profileservice.DeleteProfile(this.form.value).subscribe((res: any) => {
      console.log(res);
      if (res.Result) {
        this.toastr.success('Yay!', 'Your profile has been deleted');
        this.authService.logout();
      } else {
        this.toastr.error('Error', 'Unable to delete you');
      }
      this.spinner.hide();
    });
  }
  onUpdate() {
    this.spinner.show();
    this.profileservice.UpdateProfile(this.form.value).subscribe((res: any) => {
      console.log(res);
      if (res.Result) {
        this.toastr.success('Yay!', 'Your profile has been updated');
      } else {
        this.toastr.error('Error', 'Unable to register you');
      }
      this.spinner.hide();
    });
  }
}
