import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'projects/material/src/lib/material.module';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
// import {
//   AuthSapiensService,
//   BSUserTypeService,
//   NotificationService,
// } from '@berd/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <!-- signup.component.html -->

    <div class="center">
      <mat-card class="signup-card">
        <!-- <mat-card-header> -->
        <h1 style="text-align: center !important;">Sign Up</h1>
        <!-- </mat-card-header> -->

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <!-- Name -->
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" />
            <mat-error *ngIf="form['name'].errors?.['required']"
              >Name is <strong>required</strong></mat-error
            >
          </mat-form-field>

          <!-- Password -->

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
            <mat-label>Password</mat-label>
            <input
              formControlName="password"
              matInput
              [type]="hide1 ? 'password' : 'text'"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="hide1 = !hide1"
              [attr.aria-label]="'Hide password'"
              [attr.aria-pressed]="hide1"
            >
              <mat-icon>{{ hide1 ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form['password'].errors?.['required']"
              >Password is <strong>required</strong>
            </mat-error>
            <mat-error *ngIf="form['password'].errors?.['invalidPassword']">
              Password atleast should 8+ chars, 1 uppercase, 1 lowercase, 1
              special character, 1 number.
            </mat-error>
          </mat-form-field>

          <!-- Confirm Password -->

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
            <mat-label>Confirm Password</mat-label>
            <input
              formControlName="confirmpassword"
              matInput
              [type]="hide2 ? 'password' : 'text'"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="hide2 = !hide2"
              [attr.aria-label]="'Hide password'"
              [attr.aria-pressed]="hide2"
            >
              <mat-icon>{{ hide2 ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form['confirmpassword'].errors?.['required']"
              >Confirm Password field is <strong>required</strong>
            </mat-error>
          </mat-form-field>

          <div
            class="flex gap-10"
            style="align-items: center; justify-content:space-between; "
          ></div>
          <div
            style="color: red;"
            *ngIf="
              form['password'].valid && signupForm.hasError('passwordsMismatch')
            "
          >
            Passwords do not match
          </div>

          <!-- Email -->
          <mat-form-field appearance="outline">
            <mat-label>Enter your email</mat-label>
            <input
              matInput
              placeholder="pat@example.com"
              formControlName="email"
              required
            />
            <mat-error *ngIf="form['email'].errors?.['required']"
              >Email is <strong>required</strong></mat-error
            >
            <mat-error *ngIf="form['email'].errors?.['email']"
              >Email is <strong>not valid</strong></mat-error
            >
          </mat-form-field>

          <!-----Date of Birth---->

          <mat-form-field appearance="outline">
            <mat-label>Choose a date</mat-label>
            <input
              matInput
              formControlName="dateOfBirth"
              [matDatepicker]="picker"
            />

            <!-- <mat-hint>MM/DD/YYYY</mat-hint> -->
            <mat-datepicker-toggle
              matIconSuffix
              [for]="picker"
            ></mat-datepicker-toggle>

            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form['dateOfBirth'].errors?.['required']"
              >Date of birth is <strong>required</strong></mat-error
            >
          </mat-form-field>

          <!-- Phone Number -->
          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input
              matInput
              placeholder="Phone number"
              formControlName="phoneNumber"
              required
              maxlength="10"
            />
            <mat-error *ngIf="form['phoneNumber'].errors?.['required']"
              >Phone number is <strong>required</strong></mat-error
            >
            <mat-error
              *ngIf="!form['phoneNumber'].errors?.['required'] && form['phoneNumber'].errors?.['pattern']"
            >
              Please enter a valid number
            </mat-error>
          </mat-form-field>

          <!--  Location -->
          <mat-form-field appearance="outline">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" />
            <mat-error *ngIf="form['location'].errors?.['required']"
              >Location is <strong>required</strong></mat-error
            >
          </mat-form-field>

          <mat-card-actions class="jc-center">
            <button
              type="submit"
              style="width:50%;color:white;align:center;"
              mat-button
              [disabled]="signupForm.invalid"
              [ngStyle]="{
                'background-color': signupForm.invalid ? '#2aaa8a' : '#2aaa8a'
              }"
            >
              Sign Up
            </button>
          </mat-card-actions>
        </form>
        <div>
          <h6 style="text-align:center;color: white;">
            Already have an account,
            <button mat-button>
              <a style="cursor: pointer;color: red;" (click)="login()"
                >Log in</a
              >
            </button>
          </h6>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .signup-card {
        padding: 5px 30px;
        border-radius: 20px;
        width: 100%;
        max-width: 400px; /* Adjust as needed */
        text-align: center;
        margin: auto;
        background-color: #2d3436 !important;
        color: white !important;
      }

      .center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: 0px;
        text-align: left;
      }

      button[type='submit'] {
        width: 100%;
        color: white;
        text-align: center;
      }

      h6 {
        text-align: center;
        color: #9a9a9a;
      }

      .jc-center {
        justify-content: center;
      }
    `,
  ],
})
export class SignUpComponent {
  hide1 = true;
  hide2 = true;
  hasSpecialCharacter = new RegExp(/[ [!@#$%^&*()_+-=[]{};':"|,.<>/);
  hasNumber = new RegExp(/\d/);
  userTypes: any[] = [];
  userTypeId: any = '';
  signupForm!: FormGroup;
  isAsyncCall = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private authensService: AuthenticationService // private _bSUserTypeService: BSUserTypeService, // private notificationService: NotificationService
  ) {
    let MOBILE_PATTERN = /^[0-9]{10,10}$/;
    this.signupForm = this.formBuilder.group(
      {
        // siteId: ['', Validators.required],
        // userType: ['', Validators.required],
        name: ['', Validators.required],
        // lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(MOBILE_PATTERN)],
        ],
        dateOfBirth: ['', Validators.required],
        password: [
          '',
          Validators.compose([Validators.required, this.patternValidator()]),
        ],
        confirmpassword: ['', Validators.required],
        location: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit() {
    this.getBsUserType();
  }
  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[@$!%*?&]).{8,}$'
      );
      const valid = regex.test(control.value);
      console.log('valid', valid);
      return valid ? null : { invalidPassword: true };
    };
  }

  getBsUserType() {
    // this._bSUserTypeService.findByQuery('populate=*').subscribe((res: any) => {
    //   this.userTypes = res.data;
    // });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      console.log('Invalid Email');
    }

    const userObj: any = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      name: this.signupForm.value.name,
      phoneNumber: this.signupForm.value.phoneNumber,
      location: this.signupForm.value.location,
      dateOfBirth: this.signupForm.value.dateOfBirth,
    };

    this.isAsyncCall = true;
    this.authensService.signup(userObj).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.router.navigate(['']);
          this.toastr.success('Account Created successfully!', 'Success');
        }
      },
      (error) => {
        if (error.status === 409) {
          this.toastr.error('User is already registered.', 'Error');
        } else {
          console.error(error);
          this.toastr.error(
            'Error occurred during signup. Please try again.',
            'Error'
          );
        }
        this.isAsyncCall = false;
      }
    );
  }
  get form() {
    return this.signupForm.controls;
  }
  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmpassword')?.value;

    if (password !== confirmPassword) {
      return { passwordsMismatch: true };
    } else {
      return null;
    }
  }
  login() {
    this.router.navigateByUrl('');
  }
}
