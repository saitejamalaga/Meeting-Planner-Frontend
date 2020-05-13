import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppService } from './app.service';

//routing 
import { AppRoutingModule } from './app-routing.module';

import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { MeetingsModule } from './meetings/meetings.module'
import { SharedModule } from './shared/shared.module';

import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//Toastr Module
import { ToastrModule } from 'ngx-toastr';

//Forms Module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ServerErrorComponent } from './server-error/server-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';




@NgModule({
  declarations: [
    AppComponent,
    ServerErrorComponent,
    PageNotFoundComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    UserModule,
    ClientModule,
    MeetingsModule,
    SharedModule,
    FormsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbModalModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
