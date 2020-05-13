import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  email: any;
  password: any;


  ngOnInit(): void {

  }

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService
  ) {

  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  public goToAdminDashboard(): any {
    this.router.navigate(['/client/admin/dashboard']);
  }//end of goToAdminDashboard function

  public goToUserDashboard(): any {
    this.router.navigate(['/client/user/dashboard']);
  }//end of goToUserDashboard function

  public getIn: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')


    } else if (!this.password) {

      this.toastr.warning('enter password')


    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.signInFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {
            //console.log(apiResponse)

            Cookie.set('authToken', apiResponse.data.authToken);

            Cookie.set('receiverId', apiResponse.data.userDetails.userId);

            Cookie.set('receiverName', apiResponse.data.userDetails.userName);

            this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)

            this.toastr.success('Signup successful');

            setTimeout(() => {

              if (apiResponse.data.userDetails.isAdmin == "true") {
                this.goToAdminDashboard();
              } else {
                this.goToUserDashboard();
              }

            }, 2000);

          } else {

            this.toastr.error(apiResponse.message)


          }

        }, (err) => {
          this.toastr.error('some error occured')

        });

    } // end condition

  } // end signinFunction

}