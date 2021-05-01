import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './application/login/login.component';
import { DashboardComponent } from './application/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SideNavComponent } from './application/side-nav/side-nav.component';
import { UserregisterationComponent } from './application/userregisteration/userregisteration.component';
import { AppConfigService } from './app-config.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './application/profile/profile.component';
import { EducationComponent } from './application/education/education.component';
import { UserregistrationService } from './services/userregistration.service';
import { EducationService } from './services/education.service';
import { ProfileService } from './services/profile.service';
import { AuthGuard } from './services/auth.guard';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxSpinnerModule } from "ngx-spinner";
import { DataTablesModule } from 'angular-datatables';
const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};
const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'education', component: EducationComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: UserregisterationComponent },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SideNavComponent,
    UserregisterationComponent,
    ProfileComponent,
    EducationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DataTablesModule,
    NgbModule.forRoot(),
    AutocompleteLibModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    AppConfigService,
    UserregistrationService,
    EducationService,
    ProfileService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
