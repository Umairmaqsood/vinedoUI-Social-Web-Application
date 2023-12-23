import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'projects/material/src/public-api';
import { uploadMediaService } from 'projects/services/src/lib/uploadMedia/uploadMedias';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';

@Component({
  selector: 'app-upload-image-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  template: `
    <mat-card
      style=" background-color: #2d3436 !important;
        color: white !important; display:block; margin:0px auto;border-radius: 0px;width:400px; height:500px"
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
            style="max-width: 350px; max-height: 300px;"
          />
          <mat-card-actions>
            <button mat-raised-button (click)="uploadSelectedImage()">
              Upload
            </button>
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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authensService: AuthenticationService
  ) {}
  selectedFile: File | null = null;
  imagePreview: any;
  imageTitle = '';
  imageDescription = '';
  creatorId = this.data.item;

  uploadSelectedImage(): void {
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
            // Handle success response
            console.log('Image uploaded successfully:', response);
          },
          (error) => {
            // Handle error
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
  saveData() {}
}
