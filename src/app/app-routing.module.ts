import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {RouterModule ,Routes } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { VerifyEmailComponent } from './user/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from './user/update-password/update-password.component';

import { UserDashboardComponent } from './client/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './client/admin-dashboard/admin-dashboard.component';
import { CreateComponent } from './meetings/create/create.component';
import { UpdateComponent } from './meetings/update/update.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';


const routes: Routes = [

  {path :'login',component:LoginComponent},
  {path :'signup',component:SignupComponent},
  {path :'verify-email/:userId', component:VerifyEmailComponent},
  {path :'forgot-password', component:ForgotPasswordComponent},
  {path :'update-password/:validationToken', component:UpdatePasswordComponent},
  {path :'client/user/dashboard',component:UserDashboardComponent},
  {path :'client/admin/dashboard',component:AdminDashboardComponent},
  {path :'admin/meeting/create',component:CreateComponent},
  {path :'admin/meeting/update/:meetingId',component:UpdateComponent},

  

  {path :'serverError', component:ServerErrorComponent},
  {path :'about', component:AboutComponent},
  {path : '', redirectTo:'login',pathMatch:'full'},
  {path :'*',component:PageNotFoundComponent},
  {path :'**',component:PageNotFoundComponent}


];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) ,

  ],
  exports:[
    RouterModule
  ],

  declarations: []
})
export class AppRoutingModule { }
