import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'projects/material/src/public-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AsyncSpinnerButtonComponent } from '../async-spinner-button/async-spinner-button.component';

@Component({
  selector: 'app-upload-video-dialog',
  standalone: true,
  template: `
    <mat-card
      style="background-color: #2d3436 !important;
             color: white !important; display:block; margin:0px auto;border-radius: 0px;width:400px; height:500px"
    >
      <div style="display: flex;justify-content: flex-end;">
        <button mat-icon-button aria-label="close dialog" mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-card-content style="padding:1px 20px">
        <h2>Upload Video</h2>
        <mat-form-field appearance="outline" class="full">
          <input matInput placeholder="Video Title" [(ngModel)]="videoTitle" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <input
            matInput
            placeholder="Video Description"
            [(ngModel)]="videoDescription"
          /> </mat-form-field
        ><br />

        <button mat-raised-button (click)="fileInput.click()">
          Upload Video
        </button>
        <input
          #fileInput
          type="file"
          accept="video/*"
          style="display: none"
          (change)="onFileSelected($event)"
        />
        <div *ngIf="videoPreview">
          <h3 style="text-align:center">Preview Video</h3>
          <video
            controls
            [src]="videoPreview"
            style="width: 350px; height: 300px;"
          ></video>
          <mat-card-actions>
            <app-async-spinner-button
              [isAsyncCall]="isAsyncCall"
              (click)="uploadSelectedVideo()"
              >Upload</app-async-spinner-button
            >
          </mat-card-actions>
        </div>
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
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncSpinnerButtonComponent,
  ],
})
export class UploadVideoDialogComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<UploadVideoDialogComponent>,
    private authensService: AuthenticationService,
    private matSnackBar: MatSnackBar
  ) {}
  isAsyncCall = false;
  selectedVideo: File | null = null;
  videoPreview: any;
  videoTitle = '';
  videoDescription = '';
  creatorId = this.data.item;

  uploadSelectedVideo(): void {
    this.isAsyncCall = true;

    if (this.selectedVideo) {
      this.authensService
        .uploadVideo(
          this.videoTitle,
          this.videoDescription,
          this.creatorId,
          this.selectedVideo
        )
        .subscribe(
          (response) => {
            this.showSnackbar();
            this.matDialogRef.close(true);
            this.isAsyncCall = false;
          },
          (error) => {
            // Handle error
            console.error('Error uploading video:', error);
          }
        );
    }
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedVideo = input.files[0];

      // Set up video preview
      const reader = new FileReader();
      reader.onload = () => {
        this.videoPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedVideo);
    }
  }

  showSnackbar(): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.matSnackBar.open(`VIDEO UPLOADED SUCCESSFULLY!`, 'X', config);
  }
}
