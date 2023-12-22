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
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'projects/material/src/public-api';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { AsyncSpinnerComponent } from 'src/app/components';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AsyncSpinnerComponent,
  ],
  template: `
    <div class="container">
      <div class="content">
        <mat-card *ngIf="resetPasswordStep === 1" class="login">
          <mat-card-header>
            <mat-card-title>Forget Password</mat-card-title>
          </mat-card-header>
          <form
            [formGroup]="otpFormGroup"
            (ngSubmit)="onSubmitEmail()"
            class="example-container"
          >
            <mat-form-field appearance="outline">
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
                type="email"
                formControlName="email"
                placeholder="vinedo@example.com"
                required
              />
            </mat-form-field>
            <mat-card-actions>
              <button type="submit" mat-raised-button class="mat-btn">
                Send OTP
              </button>
            </mat-card-actions>
          </form>
        </mat-card>

        <mat-card *ngIf="resetPasswordStep === 2" class="login">
          <mat-card-header>
            <mat-card-title>Enter OTP</mat-card-title>
          </mat-card-header>
          <form
            [formGroup]="otpFormGroup"
            (ngSubmit)="onSubmitOtp()"
            class="example-container"
          >
            <mat-form-field appearance="outline">
              <mat-label>Enter OTP</mat-label>
              <input
                matInput
                type="text"
                formControlName="otp"
                placeholder="Enter OTP"
                required
              />
            </mat-form-field>
            <mat-card-actions>
              <button type="submit" mat-raised-button class="mat-btn">
                Verify OTP
              </button>
            </mat-card-actions>
          </form>
        </mat-card>

        <mat-card *ngIf="resetPasswordStep === 3" class="login">
          <mat-card-header>
            <mat-card-title>Reset Password</mat-card-title>
          </mat-card-header>
          <form
            [formGroup]="passwordFormGroup"
            (ngSubmit)="onSubmitPassword()"
            class="example-container"
          >
            <mat-form-field appearance="outline">
              <mat-icon matPrefix
                ><svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.75 0.5C13.6959 0.499758 12.6565 0.746425 11.7149 1.22023C10.7734 1.69404 9.95589 2.38181 9.328 3.22844C8.7001 4.07506 8.27925 5.057 8.09917 6.09555C7.91909 7.13411 7.98479 8.20041 8.291 9.209L0.5 17V21.5H5L12.791 13.709C13.7194 13.9908 14.6977 14.0692 15.6591 13.9387C16.6206 13.8083 17.5426 13.4721 18.3624 12.953C19.1821 12.434 19.8804 11.7444 20.4095 10.9311C20.9386 10.1178 21.2862 9.20001 21.4285 8.24025C21.5709 7.28049 21.5046 6.30132 21.2343 5.36948C20.964 4.43764 20.496 3.57502 19.8622 2.84042C19.2283 2.10582 18.4436 1.51649 17.5614 1.11261C16.6792 0.708724 15.7203 0.499775 14.75 0.5ZM14.75 12.5C14.2336 12.4997 13.7201 12.4234 13.226 12.2735L12.3657 12.0125L11.7305 12.6478L9.34475 15.0335L8.3105 14L7.25 15.0605L8.28425 16.0947L7.09475 17.2843L6.0605 16.25L5 17.3105L6.03425 18.3447L4.379 20H2V17.621L9.3515 10.2695L9.9875 9.63425L9.7265 8.774C9.40594 7.71724 9.42676 6.58631 9.78601 5.54207C10.1453 4.49784 10.8247 3.59347 11.7275 2.95762C12.6304 2.32177 13.7108 1.98681 14.815 2.0004C15.9192 2.01398 16.9911 2.37542 17.878 3.03329C18.765 3.69116 19.4219 4.61197 19.7554 5.66473C20.0888 6.71749 20.0818 7.84859 19.7354 8.89714C19.3889 9.94569 18.7206 10.8583 17.8256 11.5051C16.9305 12.152 15.8543 12.5001 14.75 12.5Z"
                    fill="#9A9A9A"
                  />
                </svg>
              </mat-icon>

              <mat-label>Enter new password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                placeholder="Enter new password"
                required
                [type]="hide1 ? 'password' : 'text'"
              />
              <button
                mat-icon-button
                matSuffix
                (click)="hide1 = !hide1"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hide1"
              >
                <mat-icon>{{
                  hide1 ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-icon matPrefix
                ><svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.75 0.5C13.6959 0.499758 12.6565 0.746425 11.7149 1.22023C10.7734 1.69404 9.95589 2.38181 9.328 3.22844C8.7001 4.07506 8.27925 5.057 8.09917 6.09555C7.91909 7.13411 7.98479 8.20041 8.291 9.209L0.5 17V21.5H5L12.791 13.709C13.7194 13.9908 14.6977 14.0692 15.6591 13.9387C16.6206 13.8083 17.5426 13.4721 18.3624 12.953C19.1821 12.434 19.8804 11.7444 20.4095 10.9311C20.9386 10.1178 21.2862 9.20001 21.4285 8.24025C21.5709 7.28049 21.5046 6.30132 21.2343 5.36948C20.964 4.43764 20.496 3.57502 19.8622 2.84042C19.2283 2.10582 18.4436 1.51649 17.5614 1.11261C16.6792 0.708724 15.7203 0.499775 14.75 0.5ZM14.75 12.5C14.2336 12.4997 13.7201 12.4234 13.226 12.2735L12.3657 12.0125L11.7305 12.6478L9.34475 15.0335L8.3105 14L7.25 15.0605L8.28425 16.0947L7.09475 17.2843L6.0605 16.25L5 17.3105L6.03425 18.3447L4.379 20H2V17.621L9.3515 10.2695L9.9875 9.63425L9.7265 8.774C9.40594 7.71724 9.42676 6.58631 9.78601 5.54207C10.1453 4.49784 10.8247 3.59347 11.7275 2.95762C12.6304 2.32177 13.7108 1.98681 14.815 2.0004C15.9192 2.01398 16.9911 2.37542 17.878 3.03329C18.765 3.69116 19.4219 4.61197 19.7554 5.66473C20.0888 6.71749 20.0818 7.84859 19.7354 8.89714C19.3889 9.94569 18.7206 10.8583 17.8256 11.5051C16.9305 12.152 15.8543 12.5001 14.75 12.5Z"
                    fill="#9A9A9A"
                  />
                </svg>
              </mat-icon>
              <mat-label>Confirm password</mat-label>
              <input
                matInput
                type="password"
                formControlName="confirmPassword"
                placeholder="Confirm password"
                required
                [type]="hide2 ? 'confirmPassword' : 'text'"
              />
              <button
                mat-icon-button
                matSuffix
                (click)="hide2 = !hide2"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hide2"
              >
                <mat-icon>{{
                  hide2 ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
            </mat-form-field>
            <mat-card-actions>
              <button type="submit" mat-raised-button class="mat-btn">
                Update Password
              </button>
            </mat-card-actions>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        height: 100vh;
      }

      .content {
        flex: 1;
        height: 100%;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .login {
        max-width: 400px;
        width: 100%;
        margin: 20px;
        background-color: #2d3436 !important;
        color: white !important;
      }

      .example-container {
        padding: 20px;
      }

      mat-card {
        background-color: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .mat-btn {
        background-color: #2aaa8a !important;
      }

      mat-card-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
      }

      mat-form-field {
        width: 100%;
      }

      mat-card-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }

      button {
        margin-left: 10px;
      }
    `,
  ],
})
export class ForgotPasswordComponent {
  hide1 = true;
  hide2 = true;
  resetPasswordStep = 1;
  isAsyncCall = false;

  otpFormGroup!: FormGroup;
  passwordFormGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authensService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.otpFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
    });

    this.passwordFormGroup = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmitEmail() {
    if (this.otpFormGroup && this.otpFormGroup.get('email')) {
      const emailControl = this.otpFormGroup.get('email');
      if (emailControl && emailControl.valid) {
        const email: string = emailControl.value;
        this.isAsyncCall = true;
        this.authensService.forgotPassword(email).subscribe((res: any) => {
          if (res?.isConfirmed) {
            this.resetPasswordStep = 2;
            this.isAsyncCall = false;
          }
        });
        // Make API call to send OTP for provided email
        // Handle success or error response accordingly
        // For example:
      }
    }
  }

  onSubmitOtp() {
    if (
      this.otpFormGroup &&
      this.otpFormGroup.get('email') &&
      this.otpFormGroup.get('otp')
    ) {
      const emailControl = this.otpFormGroup.get('email');
      const otpControl = this.otpFormGroup.get('otp');

      if (
        emailControl &&
        otpControl &&
        emailControl.valid &&
        otpControl.valid
      ) {
        const email: string = emailControl.value;
        const otp: string = otpControl.value;
        this.isAsyncCall = true;
        this.authensService.otpValidation(email, otp).subscribe((res: any) => {
          if (res?.isConfirmed) {
            this.resetPasswordStep = 3;
            this.isAsyncCall = false;
          }
        });
      }
    }
  }

  onSubmitPassword() {
    if (this.passwordFormGroup && this.passwordFormGroup.valid) {
      const password: string = this.passwordFormGroup.value.password;
      const confirmPassword: string =
        this.passwordFormGroup.value.confirmPassword;

      if (password !== confirmPassword) {
        this.toastr.error('Passwords do not match');
        return;
      }

      if (this.otpFormGroup && this.otpFormGroup.get('email')) {
        const emailControl = this.otpFormGroup.get('email');

        if (emailControl && emailControl.valid) {
          const email: string = emailControl.value;
          this.isAsyncCall = true;
          this.authensService
            .confirmPassword(email, password, confirmPassword)
            .subscribe((res: any) => {
              if (res?.isConfirmed) {
                this.toastr.success('Password updated successfully');
                this.router.navigateByUrl('');
                this.isAsyncCall = false;
              }
            });
        }
      }
    }
  }
}
