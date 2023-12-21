import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from 'projects/material/src/public-api';
// import {
//   AuthSapiensService,
//   BiUserService,
//   NotificationService,
// } from '@berd/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="content"></div>
    </div>
    <div
      class="login"
      style="position: fixed;top:40px;width:100%;"
      *ngIf="forget_password"
    >
      <mat-card
        style="display: block;   background-color: #2d3436 !important;
        color: white !important; margin:0px auto;border-radius: 20px;width:400px"
        class="example-card"
      >
        <div
          style="padding-top:10px; padding-bottom:10px; justify-content: center; display:flex;"
        >
          <mat-card-header>
            <h1 style="text-align: center !important;">
              Forget Password
            </h1></mat-card-header
          >
        </div>

        <form
          [formGroup]="forgetpwd"
          (ngSubmit)="onSubmit()"
          class="example-container"
          style="padding-right: 50px;
          padding-left:50px"
        >
          <mat-form-field appearance="outline" style="width:100%;">
            <mat-icon matPrefix
              ><svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.1212 15.8969C16.679 14.8496 16.0374 13.8984 15.2321 13.0961C14.4292 12.2915 13.4781 11.65 12.4313 11.207C12.4219 11.2023 12.4126 11.2 12.4032 11.1953C13.8633 10.1406 14.8126 8.42266 14.8126 6.48438C14.8126 3.27344 12.211 0.671875 9.00006 0.671875C5.78912 0.671875 3.18756 3.27344 3.18756 6.48438C3.18756 8.42266 4.13678 10.1406 5.59693 11.1977C5.58756 11.2023 5.57818 11.2047 5.56881 11.2094C4.51881 11.6523 3.57662 12.2875 2.76803 13.0984C1.96344 13.9013 1.32194 14.8524 0.878965 15.8992C0.443782 16.924 0.209079 18.0228 0.187559 19.1359C0.186933 19.161 0.191321 19.1858 0.200463 19.2091C0.209605 19.2324 0.223317 19.2537 0.240791 19.2716C0.258264 19.2895 0.279146 19.3037 0.302206 19.3134C0.325265 19.3231 0.350036 19.3281 0.375059 19.3281H1.78131C1.88443 19.3281 1.96646 19.2461 1.96881 19.1453C2.01568 17.3359 2.74225 15.6414 4.02662 14.357C5.35553 13.0281 7.12037 12.2969 9.00006 12.2969C10.8797 12.2969 12.6446 13.0281 13.9735 14.357C15.2579 15.6414 15.9844 17.3359 16.0313 19.1453C16.0337 19.2484 16.1157 19.3281 16.2188 19.3281H17.6251C17.6501 19.3281 17.6749 19.3231 17.6979 19.3134C17.721 19.3037 17.7419 19.2895 17.7593 19.2716C17.7768 19.2537 17.7905 19.2324 17.7997 19.2091C17.8088 19.1858 17.8132 19.161 17.8126 19.1359C17.7891 18.0156 17.5571 16.9258 17.1212 15.8969ZM9.00006 10.5156C7.92428 10.5156 6.91178 10.0961 6.15006 9.33438C5.38834 8.57266 4.96881 7.56016 4.96881 6.48438C4.96881 5.40859 5.38834 4.39609 6.15006 3.63437C6.91178 2.87266 7.92428 2.45312 9.00006 2.45312C10.0758 2.45312 11.0883 2.87266 11.8501 3.63437C12.6118 4.39609 13.0313 5.40859 13.0313 6.48438C13.0313 7.56016 12.6118 8.57266 11.8501 9.33438C11.0883 10.0961 10.0758 10.5156 9.00006 10.5156Z"
                  fill="#9A9A9A"
                />
              </svg>
            </mat-icon>

            <mat-label>Enter your email</mat-label>
            <input
              matInput
              placeholder="vinedo@example.com"
              formControlName="email"
              required
            />
          </mat-form-field>
          <mat-card-actions
            style="width:100%; padding-bottom:90px;display:flex;flex-direction: column;gap:15px"
          >
            <button
              type="submit"
              style="background-color: #2aaa8a;width:100%;color:white"
              mat-button
            >
              Continue
            </button>
            <div
              style="display:flex;align-items:center;justify-content:center;color:rgba(0, 0, 0, 0.38)"
            >
              <mat-icon style="color:white">keyboard_arrow_left</mat-icon>
              <a href="/" style="color:white;text-decoration:none">
                Back to login</a
              >
            </div>
          </mat-card-actions>
        </form>
      </mat-card>
    </div>
    <div
      class="login"
      style="position: fixed;top:0px;width:100%;"
      *ngIf="reset_password"
    >
      <mat-card
        style="display: inline-block;border-radius: 20px;width:500px"
        class="example-card"
      >
        <div style="padding-top:50px; justify-content: center; display:flex;">
          <mat-card-header> <h2>Forget Password</h2></mat-card-header>
        </div>
        <div
          style="padding-right: 100px;
          padding-left:100px; padding-bottom:30px;"
        >
          <p style="font-size: 14px;line-height: 20px;text-align:justify;">
            If we found an eligible account associated with that username, we've
            sent password reset instructions to the primary email address on the
            account.
          </p>
          <p style="font-size: 14px;line-height: 20px;text-align:justify;">
            Still having trouble logging in?<br />
            <a href="#">Contact Support</a>.
          </p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    '.container{display:flex;height:100vh}.content{flex: 1;height: 100%;overflow: auto;}',
  ],
})
export class ForgotPasswordComponent {
  private _email: any;
  public reset_password: boolean = false;
  public forget_password: boolean = true;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  forgetpwd!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router // private biUser: BiUserService, // private _notificationService: NotificationService, // private _authSapiensService: AuthSapiensService
  ) {}

  ngOnInit() {
    this.forgetpwd = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.forgetpwd.valid) {
      const email: string = this.forgetpwd.value.email;
      this.continue(email);
    } else {
      // this._notificationService.showError('Email is required');
    }
  }
  continue(email: string) {
    //   this._authSapiensService.sendMail(email).subscribe({
    //     next: (res) => {
    //       this.reset_password = true;
    //       this.forget_password = false;
    //     },
    //     error: (err) => {
    //       this._notificationService.showError(err.error.error.message);
    //     },
    //   });
  }
}
