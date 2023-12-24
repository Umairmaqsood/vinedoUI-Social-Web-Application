import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MaterialModule } from 'projects/material/src/lib/material.module';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { AsyncSpinnerButtonComponent } from '../async-spinner-button/async-spinner-button.component';

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    AsyncSpinnerButtonComponent,
  ],
  standalone: true,
  template: `
    <mat-card
      style=" background-color: #2d3436 !important;
        color: white !important; display:block; margin:0px auto;border-radius: 0px;width:400px; height:500px"
    >
      <mat-card-header> </mat-card-header>

      <div style="display: flex;justify-content: flex-end;">
        <button mat-icon-button aria-label="close dialog" mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-card-content style="padding:20px">
        <form [formGroup]="editDataForm">
          <mat-form-field appearance="outline" class="w-8" class="full">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="name" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-8" class="full">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" placeholder="location" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-8" class="full">
            <mat-label>Bio</mat-label>
            <textarea
              matInput
              formControlName="bio"
              placeholder="bio"
            ></textarea>
          </mat-form-field>
        </form>

        <label> Link Socials</label>
        <div class="flex gap-20 m-t-10">
          <img [src]="twitterUrl" alt="twitter" class="socialIcon" />
          <img [src]="instaUrl" alt="Insta" class="socialIcon" />
          <img [src]="tiktokUrl" alt="tiktok" class="socialIcon" />
        </div>
      </mat-card-content>

      <mat-card-actions>
        <!-- <button mat-raised-button class="saveBtn" (click)="saveData()">
          Save
        </button> -->

        <app-async-spinner-button
          [isAsyncCall]="isAsyncCall"
          (click)="saveData()"
          >Save</app-async-spinner-button
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
export class EditProfileDialogComponent {
  @Output() dataUpdated = new EventEmitter<any>();

  isAsyncCall = false;
  twitterUrl = 'assets/pictures/twitter.png';
  instaUrl = 'assets/pictures/insta.png';
  tiktokUrl = 'assets/pictures/tiktok.png';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<EditProfileDialogComponent>,
    private _fb: FormBuilder,
    private authensService: AuthenticationService,
    private snackbar: MatSnackBar
  ) {
    console.log(data, 'data');
  }

  editDataForm = this._fb.group({
    name: [undefined as any],
    location: [undefined as any, [Validators.required]],
    bio: [undefined as any, [Validators.required]],
  });

  get name() {
    return this.editDataForm.controls.name;
  }
  get location() {
    return this.editDataForm.controls.location;
  }
  get bio() {
    return this.editDataForm.controls.bio;
  }

  ngOnInit() {
    this.patchValue();
  }

  patchValue() {
    const data = this.data;
    this.editDataForm.patchValue({
      name: data.item.name,
      location: data.item.location,
      bio: data.item.bio,
    });
  }

  saveData() {
    this.isAsyncCall = true;
    if (this.editDataForm.valid) {
      const updatedData = {
        name: this.editDataForm.value.name,
        location: this.editDataForm.value.location,
        bio: this.editDataForm.value.bio,
      };

      this.authensService
        .updatePersonalInfo(
          this.data.item.userId,
          updatedData.name,
          updatedData.location,
          updatedData.bio
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
    this.snackbar.open(`PERSONAL INFO UPDATED SUCCESSFULLY`, 'X', config);
  }
}
