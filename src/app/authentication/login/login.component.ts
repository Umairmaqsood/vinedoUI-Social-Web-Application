import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'projects/material/src/public-api';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';

export interface LoginRequestData {
  rememberMe: boolean;
  email: string;
  password: string;
  authcode?: any;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="container">
      <div class="content"></div>
    </div>

    <div class="login" style="position: fixed;top:30px;width:100%;">
      <mat-card
        style=" padding: 1px 30px; background-color: #2d3436 !important;
        color: white !important; display:block; margin:0px auto;border-radius: 20px;width:380px"
      >
        <div style="justify-content: center;display:flex;">
          <mat-card-header>
            <h1 style="text-align: center !important; color:white !important">
              Login
            </h1></mat-card-header
          >
        </div>

        <form
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="example-container"
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
              placeholder="dev@vinedo"
              formControlName="email"
              required
            />
            <mat-error *ngIf="loginForm.controls['email'].hasError('required')">
              Email is <strong>required</strong>
            </mat-error>
            <mat-error *ngIf="loginForm.controls['email'].hasError('email')">
              Email is <strong>not valid</strong>
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" style="width:100%">
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
            <mat-label>Password</mat-label>
            <input
              formControlName="password"
              matInput
              [type]="hide ? 'password' : 'text'"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="hide = !hide"
              type="button"
              [attr.aria-label]="'Hide password'"
              [attr.aria-pressed]="hide"
            >
              <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.controls['password'].invalid"
              >Password is <strong>required</strong>
            </mat-error>
          </mat-form-field>
          <div
            class="flex  gap-10"
            style="align-items: center; justify-content:space-between; "
          >
            <section class="example-section">
              <mat-checkbox class="example-margin"
                ><div style="color: white;">Remember me</div></mat-checkbox
              >
            </section>
            <h6>
              <button mat-button>
                <a style="color:white;" (click)="Forgetpwd()"
                  >Forget password</a
                >
              </button>
            </h6>
          </div>
          <mat-card-actions>
            <button
              type="submit"
              style="background-color: #2aaa8a;width:100%;color:white"
              mat-button
            >
              Login
            </button>
          </mat-card-actions>

          <div class="berd-label-light red" *ngIf="!isCorrectInfo">
            {{ errormessage }}
          </div>
        </form>
        <!-- Sign up functionality is currently not required -->
        <div>
          <h6 style="text-align:end;color: white;">
            Don't have an account,
            <button mat-button>
              <a style="color: red;" (click)="Signup()">Sign up</a>
            </button>
          </h6>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .content {
        flex: 1;
        overflow: auto;
        background-color: white;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  isAsyncCall = false;
  errormessage = '';
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  // matcher = new MyErrorStateMatcher();
  loginForm!: FormGroup;

  hide = true;
  checked = false;

  isCorrectInfo = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, // private authService: AuthService,
    private authenService: AuthenticationService,
    private toastr: ToastrService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }
  onSubmit() {
    this.isAsyncCall = true;
    this.isCorrectInfo = true;
    this.loginForm.markAllAsTouched();

    const data: LoginRequestData = this.loginForm.value;

    this.authenService.login(data).subscribe(
      (res: any) => {
        console.log(res, 'response');
        const isContentCreator = localStorage.getItem('isContentCreator');
        const decodedToken: any = jwtDecode(res.userToken);
        const userId = decodedToken._id;

        if (res.status === 200 && isContentCreator === 'true') {
          this.router.navigate(['/home-page', userId]); // Navigating with the user ID as a parameter
          this.showSnackbar();
          this.isAsyncCall = false;
        } else if (res.status === 200 && isContentCreator === 'false') {
          this.router.navigate(['/user-home-page', userId]); // Navigating with the user ID as a parameter
          this.showSnackbar();
          this.isAsyncCall = false;
        }
      },
      (error) => {
        // Handle error scenarios if needed
        console.error(error);
        this.errorSnackBar();
        this.isAsyncCall = false;
      }
    );
  }

  Signup() {
    this.router.navigateByUrl('/sign-up');
  }
  Forgetpwd() {
    this.router.navigateByUrl('/forgot-password');
  }

  showSnackbar(): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`LOGGED IN SUCCESSFULLY, SUCCESS!`, 'X', config);
  }
  errorSnackBar(): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`LOGIN fAILED. PLEASE TRY AGAIN.', 'ERROR`, 'X', config);
  }
}
