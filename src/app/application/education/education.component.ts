import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EducationService } from 'src/app/services/education.service';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import 'datatables.net';
@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {
  keyword = 'value';
  dataTable: any;
  data = [
    {
      id: 2019,
      value: '2019'
    },
    {
      id: 2018,
      value: '2018'
    },
    {
      id: 2017,
      value: '2017'
    }
    ,
    {
      id: 2016,
      value: '2016'
    }
  ];
  form = new FormGroup({
    Id: new FormControl(0),
    Email: new FormControl(''),
    ProfileId: new FormControl(0),
    DegreeTitle: new FormControl('', Validators.required),
    School: new FormControl('', Validators.required),
    PassingYear: new FormControl('', Validators.required),
    TotalMarks: new FormControl('', Validators.required),
    MarksObtained: new FormControl(0, [Validators.required]),
    Percentage: new FormControl({ value: 0, disabled: true }, Validators.required),
    isActive: new FormControl(false)
  });
  isAdd = false;
  user: any;
  listeducation: any = [];
  closeResult: string;
  constructor(private educationservice: EducationService, private authService: AuthService, private spinner: NgxSpinnerService,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.keyword = 'value';
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getControl('Email').patchValue(this.user.Email.trim());
    this.getControl('ProfileId').patchValue(this.user.Id);
    console.log(this.form.value);
    this.getEducationList();
  }
  ngAfterViewInit() {

  }
  getControl(name) {
    return this.form.get(name);
  }
  getEducationList() {
    this.spinner.show();
    let requestob = { Email: this.user.Email, ProfileId: this.user.Id };
    this.educationservice.GetEducationList(requestob).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.listeducation = res.Result;
      } else {
        this.authService.logout();
      }
      this.spinner.hide();
    });
  }
  onAdd() {
    this.form.reset();
    this.isAdd = true;
  }
  onCancel() {
    this.isAdd = false;
  }
  onChange(element) {
    console.log('on change', element);
    if (this.form.get('TotalMarks').value > 0) {
      let percentage = (this.form.get('MarksObtained').value / this.form.get('TotalMarks').value) * 100;
      this.form.get('Percentage').patchValue(Math.floor(percentage));
    }
  }
  checkPercentage() {
    if (this.form.get('MarksObtained').value > 0 &&
      parseInt(this.form.get('TotalMarks').value) < parseInt(this.form.get('MarksObtained').value)) {
      this.toastr.error('Marks Obtained cannot be greater than Total Marks ');
      return false;
    }
    return true;
  }
  onSubmit() {
    if (!this.checkPercentage()) {
      this.toastr.error('Please correct the errors of the submitted form. ');
      return;
    }
    this.spinner.show();
    let requestob = this.form.value;
    requestob.Percentage = this.form.get('Percentage').value;
    requestob.ProfileId = this.user.Id;
    console.log(requestob);
    if (this.form.get('Id').value > 0) {
      this.educationservice.UpdateEducation(requestob).subscribe((res: any) => {
        if (res) {
          console.log('Update Result', res);
          this.listeducation = res.Result;
          this.isAdd = false;
        } else {
          this.toastr.error('Error!');
          this.authService.logout();
        }
        this.spinner.hide();
      });
    } else {
      requestob.Id = 0;
      this.educationservice.AddEducation(requestob).subscribe((res: any) => {
        if (res) {
          this.listeducation = res.Result;
          this.isAdd = false;
        } else {
          this.toastr.error('Error!');
        }
        this.spinner.hide();
      });
    }
  }
  onUpdate(foundelement) {
    console.log(foundelement);
    if (foundelement != undefined) {
      //this.keyword = foundelement.PassingYear;
      this.form.get('Email').patchValue(this.user.Email);
      this.form.get('School').patchValue(foundelement.School);
      this.form.get('DegreeTitle').patchValue(foundelement.DegreeTitle);
      this.form.get('PassingYear').patchValue(foundelement.PassingYear);
      this.form.get('TotalMarks').patchValue(foundelement.TotalMarks);
      this.form.get('MarksObtained').patchValue(foundelement.MarksObtained);
      this.form.get('Percentage').patchValue(foundelement.Percentage);
      this.form.get('isActive').patchValue(foundelement.isActive);
      this.form.get('Id').patchValue(foundelement.Id);
      this.isAdd = true;

    }
  }
  ActiveInactive(foundelement) {
    this.spinner.show();
    foundelement.Email = this.user.Email;
    foundelement.isActive = !foundelement.isActive;
    //this.keyword = foundelement.PassingYear;
    console.log(foundelement);
    this.educationservice.UpdateEducation(foundelement).subscribe((res: any) => {
      if (res) {
        this.listeducation = res.Result;
        console.log(this.listeducation);
      } else {
        this.toastr.error('Error!');
        this.authService.logout();
      }
      this.spinner.hide();
    });
  }
  Delete(element) {
    this.spinner.show();
    element.Email = this.user.Email;
    this.educationservice.DeleteEducation(element).subscribe((res: any) => {
      if (res) {
        this.listeducation = res.Result;
        console.log(this.listeducation);
      } else {
        this.toastr.error('Error!');
      }
    });
    this.spinner.hide();
  }
  selectEvent(item) {
    this.getControl('PassingYear').patchValue(item.value);
  }
}
