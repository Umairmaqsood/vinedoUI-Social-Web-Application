import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'projects/material/src/public-api';
import { PaypalDialogComponent } from '../paypal-dialog/paypal-dialog.component';
import { CommonModule } from '@angular/common';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { NotificationsDialogComponent } from '../notifications-dialog/notifications-dialog.component';
import { uploadMediaService } from 'projects/services/src/lib/uploadMedia/uploadMedias';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadImageDialogComponent } from '../upload-image-dialog/upload-image-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AsyncSpinnerComponent } from '../async-spinner/async-spinner.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SearchBarComponent,
    AsyncSpinnerComponent,
  ],
  template: `
    <app-search-bar></app-search-bar>
    <div class="profile-cover">
      <!-- Profile Cover Image -->
      <img
        [src]="coverImageUrl"
        alt="Profile Cover Image"
        (click)="onCoverImageClick()"
        style="width: 100%; height: 260px; overflow: hidden; object-fit: cover; cursor:pointer"
      />
      <input
        type="file"
        style="display: none;"
        (change)="onCoverImageSelected($event)"
        #coverInput
      />
    </div>

    <div class="home-container">
      <div class="flex" style="justify-content:space-between">
        <div class="profile-info">
          <!-- Profile Picture -->
          <div class="profile-picture" (click)="onProfileImageClick()">
            <img
              [src]="profileImageUrl"
              alt="Profile-Picture"
              style="cursor:pointer"
            />
            <input
              type="file"
              style="display: none;"
              (change)="onProfileImageSelected($event)"
              #profileInput
            />
          </div>
        </div>

        <!-- Subscription and Content Request Buttons -->

        <div class="flex gap-40 m-t-10">
          <button
            class="mat-button"
            mat-raised-button
            (click)="openImageUploadDialog(creatorId)"
          >
            Post
          </button>

          <mat-icon class="m-t-5 cursor" (click)="openNotifications()"
            >notifications</mat-icon
          >
        </div>
      </div>

      <!-- Profile Details -->
      <div class="m-b-10">
        <div class="flex gap-20">
          <h2>{{ username }}</h2>
          <mat-icon (click)="editProfileDialog('')" class="m-t-20 cursor"
            >edit</mat-icon
          >
        </div>
        <div class="flex gap-20">
          <div class="flex gap-10">
            <mat-icon>location_on</mat-icon>
            <label class="m-t-5">{{ location }}</label>
          </div>
          <div class="flex gap-10">
            <mat-icon>date_range</mat-icon>
            <label class="m-t-5">joined {{ joined }}</label>
          </div>
        </div>
        <div style="width:40%">
          <p>
            {{ bioShortened ? bio.slice(0, 50) + '...' : bio }}
            <button
              style="color:#2aaa8a"
              *ngIf="showReadMore"
              mat-button
              (click)="toggleBio()"
            >
              {{ bioShortened ? 'Read More' : 'Read Less' }}
            </button>
          </p>
        </div>

        <!-- Social Media Buttons -->
        <div class="flex gap-20">
          <img [src]="twitterUrl" alt="twitter" class="socialIcon" />

          <img [src]="instaUrl" alt="Insta" class="socialIcon" />

          <img [src]="tiktokUrl" alt="tiktok" class="socialIcon" />
        </div>
      </div>

      <!-- Tab Group -->
      <div class="mat-tab-color mat-tab-ripple m-top-30">
        <mat-tab-group>
          <mat-tab>
            <ng-template mat-tab-label>
              <span class="custom-tab-label">Videos</span>
            </ng-template>
            Content 1
          </mat-tab>
          <mat-tab>
            <ng-template mat-tab-label>
              <span class="custom-tab-label">Pictures</span>
            </ng-template>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [
    '.home-container{padding:0px 100px !important} .custom-tab-label { color: white !important; } .mat-button { color:white !important;background-color: #1a1a1a !important; border:1px solid white } .mat-icon-label { margin-top: 4px; } .profile-picture { width: 150px; height: 150px; overflow: hidden; border-radius: 50%; } .profile-picture img{width: 100%;height: 100%;object-fit: cover;} .profile-info{margin-top:-70px} .profile-cover{margin:0px !important; padding:0px !important} .socialIcon{cursor:pointer; width:70px} cursor:{cursor:pointer}',
  ],
})
export class HomePageComponent {
  creatorId: any;
  userId: any;
  location: any;
  username: any;
  bio: any;
  joined: any;
  // bio = `Im a music artist, passionate about crafting soulful melodies that resonate with the heart. My music tells my story, taking you on a sonic journey through emotions and experiences. You can find me either performing live on stage or in the studio, where I bring my creative visions to life through sound.`;
  bioShortened = true;
  showReadMore = false;
  coverImageUrl = 'assets/pictures/pic1.jpg';
  profileImageUrl = 'assets/pictures/pic1.jpg';
  twitterUrl = 'assets/pictures/twitter.png';
  instaUrl = 'assets/pictures/insta.png';
  tiktokUrl = 'assets/pictures/tiktok.png';

  @ViewChild('coverInput') coverInput?: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput?: ElementRef<HTMLInputElement>;

  constructor(private dialog: MatDialog, private route: ActivatedRoute) {}

  toggleBio() {
    this.bioShortened = !this.bioShortened;
  }

  ngOnInit() {
    // Retrieve the userId and location from the URL query parameters
    this.route.paramMap.subscribe((params: any) => {
      this.creatorId = params.get('userId') || '';
      console.log(this.creatorId);
    });

    this.location = localStorage.getItem('userLocation');
    this.username = localStorage.getItem('userName');
    this.bio = localStorage.getItem('userBio');
    this.joined = localStorage.getItem('userCreated');
    if (this.bio && this.bio?.length > 50) {
      this.showReadMore = true;
    }
    console.log(this.bio, 'bio');
  }

  openImageUploadDialog(item: any) {
    const dialog = this.dialog.open(UploadImageDialogComponent, {
      data: {
        item,
      },
      width: '400px',
      height: '500px',
    });
  }

  openNotifications() {
    const dialog = this.dialog.open(NotificationsDialogComponent, {
      width: '700px',
      height: '300px',
    });
  }

  editProfileDialog(item: any) {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      data: {
        item: {
          name: this.username,
          location: this.location,
          bio: this.bio,
        },
      },
      width: '400px',
      height: '500px',
    });
    dialogRef.componentInstance.dataUpdated.subscribe((updatedData: any) => {
      this.username = updatedData.name;
      this.location = updatedData.location;
      this.bio = updatedData.bio;
    });
  }

  onCoverImageClick() {
    if (this.coverInput) {
      this.coverInput.nativeElement.click();
    }
  }

  onProfileImageClick() {
    if (this.profileInput) {
      this.profileInput.nativeElement.click();
    }
  }

  onCoverImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Handle uploading the cover image file (you may need to implement an upload service)
      // For demo purposes, update the coverImageUrl with the uploaded file
      this.coverImageUrl = URL.createObjectURL(file);
    }
  }

  onProfileImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Handle uploading the profile image file (you may need to implement an upload service)
      // For demo purposes, update the profileImageUrl with the uploaded file
      this.profileImageUrl = URL.createObjectURL(file);
    }
  }
}
