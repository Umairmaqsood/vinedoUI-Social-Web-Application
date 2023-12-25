import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'projects/material/src/public-api';
import { uploadMediaService } from 'projects/services/src/lib/uploadMedia/uploadMedias';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { AsyncSpinnerButtonComponent } from '../async-spinner-button/async-spinner-button.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-image-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncSpinnerButtonComponent,
  ],
  template: `
    <mat-card
      style=" background-color: #2d3436 !important;
        color: white !important; display:block; margin:0px auto;border-radius: 0px;width:500px; height:500px"
    >
      <div style="display: flex;justify-content: flex-end;">
        <button mat-icon-button aria-label="close dialog" mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-card-content style="padding:1px 20px">
        <h2>Upload Image</h2>
        <!-- <form [formGroup]="editDataForm"> -->
        <!-- Inside the Pictures tab -->
        <mat-form-field appearance="outline" class="full">
          <input matInput placeholder="Image Title" [(ngModel)]="imageTitle" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <input
            matInput
            placeholder="Image Description"
            [(ngModel)]="imageDescription"
          /> </mat-form-field
        ><br />

        <button mat-raised-button (click)="fileInput.click()">
          Upload Image
        </button>
        <input
          #fileInput
          type="file"
          style="display: none"
          (change)="onFileSelected($event)"
        />
        <div *ngIf="selectedFile">
          <h3 style="text-align:center">Preview Image</h3>
          <img
            [src]="imagePreview"
            alt="Selected Image"
            style="width: 350px; height: 280px;"
          />
          <mat-card-actions>
            <app-async-spinner-button
              [isAsyncCall]="isAsyncCall"
              (click)="uploadSelectedImage()"
              >Upload</app-async-spinner-button
            >
          </mat-card-actions>
        </div>
        <!-- </form> -->
      </mat-card-content>
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
      .full {
        width: 100%;
      }
    `,
  ],
})
export class UploadImageDialogComponent {
  isAsyncCall = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<UploadImageDialogComponent>,
    private authensService: AuthenticationService,
    private matSnackBar: MatSnackBar
  ) {}
  selectedFile: File | null = null;
  imagePreview: any;
  imageTitle = '';
  imageDescription = '';
  creatorId = this.data.item;

  uploadSelectedImage(): void {
    this.isAsyncCall = true;
    if (this.selectedFile) {
      this.authensService
        .uploadImage(
          this.imageTitle,
          this.imageDescription,
          this.creatorId,
          this.selectedFile
        )
        .subscribe(
          (response) => {
            this.showSnackbar();
            this.matDialogRef.close(true);
            this.isAsyncCall = false;
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
    }
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Set up image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  showSnackbar(): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.matSnackBar.open(`IMAGE UPLOADED SUCCESSFULLY!`, 'X', config);
  }
}
