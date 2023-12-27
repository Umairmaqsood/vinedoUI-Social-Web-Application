import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MaterialModule } from 'projects/material/src/lib/material.module';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { AsyncSpinnerButtonComponent } from '../async-spinner-button/async-spinner-button.component';

@Component({
  selector: 'app-creator-pricing',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    AsyncSpinnerButtonComponent,
  ],
  template: `
    <mat-card
      style=" background-color: #2d3436 !important;
        color: white !important; display:block; margin:0px auto;border-radius: 0px;width:400px; height:460px"
    >
      <div style="display: flex;justify-content: flex-end;">
        <button mat-icon-button aria-label="close dialog" mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <h2 style="padding:0px 20px">Edit Pricing</h2>
      <mat-card-content style="padding:0px 20px">
        <form [formGroup]="editDataForm">
          <mat-form-field appearance="outline" class="w-8" class="full">
            <mat-label>Subscription Price</mat-label>
            <input type="number" matInput formControlName="subscriptionPrice" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-8" class="full">
            <mat-label>Paypal Email</mat-label>
            <input matInput formControlName="payPalEmail" />
          </mat-form-field>
        </form>

        <label> Link Socials</label>
        <div class="flex gap-20 m-t-25">
          <img [src]="twitterUrl" alt="twitter" class="socialIcon" />
          <img [src]="instaUrl" alt="Insta" class="socialIcon" />
          <img [src]="tiktokUrl" alt="tiktok" class="socialIcon" />
        </div>
      </mat-card-content>

      <mat-card-actions class="m-t-10">
        <app-async-spinner-button
          [isAsyncCall]="isAsyncCall"
          (click)="saveData()"
          style="display:block; margin:0px auto"
          >Update</app-async-spinner-button
        >
      </mat-card-actions>
    </mat-card>
  `,

  styles: [
    `
      .saveBtn {
        display: block;
        margin: 0px auto;
        background-color: #2aaa8a !important ;
        border-radius: 20px;
        margin-bottom: 20px;
      }
      .full {
        width: 100%;
      }
      .socialIcon {
        cursor: pointer;
        width: 70px;
      }
    `,
  ],
})
export class CreatorPricingComponent {
  @Output() dataUpdated = new EventEmitter<any>();

  isAsyncCall = false;
  twitterUrl = 'assets/pictures/twitter.png';
  instaUrl = 'assets/pictures/insta.png';
  tiktokUrl = 'assets/pictures/tiktok.png';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<CreatorPricingComponent>,
    private _fb: FormBuilder,
    private authensService: AuthenticationService,
    private snackbar: MatSnackBar
  ) {
    console.log(data, 'data');
  }

  editDataForm = this._fb.group({
    subscriptionPrice: [undefined as any, Validators.required],
    payPalEmail: [undefined as any, [Validators.required]],
  });

  get subscriptionPrice() {
    return this.editDataForm.controls.subscriptionPrice;
  }
  get payPalEmail() {
    return this.editDataForm.controls.payPalEmail;
  }

  ngOnInit() {
    this.patchValue();
    this.getPricing();
  }

  patchValue() {
    const data = this.data;
    this.editDataForm.patchValue({
      subscriptionPrice: data.subscriptionPrice,
      payPalEmail: data.payPalEmail,
    });
  }

  saveData() {
    this.isAsyncCall = true;
    if (this.editDataForm.valid) {
      const updatedData = {
        creatorId: this.data.item.userId,
        subscriptionPrice: this.editDataForm.value.subscriptionPrice,
        payPalEmail: this.editDataForm.value.payPalEmail,
      };

      this.authensService
        .uploadCreatorPricing(
          this.data.item.userId,
          updatedData.subscriptionPrice,
          updatedData.payPalEmail
        )
        .subscribe((res) => {
          if (res) {
            this.updateInfoSnackBar();
            this.isAsyncCall = false;
            this.matDialogRef.close(res);
          }
        });
    }
  }

  ngOnDestroy() {}

  updateInfoSnackBar() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`PRICING INFO UPDATED SUCCESSFULLY`, 'X', config);
  }

  paypalValue: any;
  subscriptionValue: any;

  getPricing() {
    this.authensService
      .getCreatorPricing(this.data?.item?.userId)
      .subscribe((res) => {
        if (res && res.result) {
          this.subscriptionValue = res.result.user.subscriptionPrice ?? '';
          this.paypalValue = res.result.user.payPalEmail ?? '';
          console.log('response of get pricing', res);

          // Patch the form with the retrieved data
          this.editDataForm.patchValue({
            subscriptionPrice: this.subscriptionValue,
            payPalEmail: this.paypalValue,
          });
        }
      });
  }
}
