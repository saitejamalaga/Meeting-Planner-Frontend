import { Component, OnInit } from '@angular/core';


import { AppService } from '../../app.service';
//import for toastr
import { ToastrService } from 'ngx-toastr';
//import for Routing
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public email: any;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,

  ) { }

  ngOnInit() {
  }

  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  }

  public forgotPassword(): any {

    if (!this.email) {
      this.toastr.warning("Email is required", "Warning!");
    }
    else {
      let data = {
        email: this.email,
      } 
      this.appService.resetPassword(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
            this.toastr.success("Reset Password", "Password reset instructions sent successfully");
            setTimeout(() => {

              this.goToSignIn();

            }, 2000);

          }
          else {
            this.toastr.error(apiResponse.message, "Error!");
          }
        },
          (error) => {
            if (error.status == 404) {
              this.toastr.warning("Reset Password Failed", "Email Not Found!");
            }
            else {
              this.toastr.error("Some Error Occurred", "Error!");
              this.router.navigate(['/serverError']);

            }

          });
    }
  }
}
