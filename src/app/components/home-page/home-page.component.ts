import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'projects/material/src/public-api';
import { CommonModule } from '@angular/common';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { NotificationsDialogComponent } from '../notifications-dialog/notifications-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadImageDialogComponent } from '../upload-image-dialog/upload-image-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncSpinnerComponent } from '../async-spinner/async-spinner.component';
import { UploadVideoDialogComponent } from '../upload-video-dialog/upload-video-dialog.component';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncSpinnerComponent,
  ],
  template: `
    <!-- <app-async-spinner *ngIf="isAsyncCall"></app-async-spinner> -->
    <!-- <ng-container *ngIf="!isAsyncCall"> -->
    <!------------------------- Navbar ----------------------------->

    <div class="container">
      <mat-toolbar color="primary">
        <mat-toolbar-row>
          <div fxHide.lt-sm fxShow.gt-sm>
            <!-- Logo -->
            <img src="assets/pictures/vinedo.png" alt="Logo" height="40px" />
          </div>
          <div fxHide.lt-sm fxShow.gt-sm class="spacer"></div>

          <div class="spacer"></div>
          <div>
            <!-- Logout Button -->
            <button mat-icon-button (click)="logout()">
              <mat-icon style="color:white">logout</mat-icon>
            </button>
          </div>
        </mat-toolbar-row>
      </mat-toolbar>
    </div>

    <!------------------------ Cover Image ----------------------------->

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

    <!------------------------ Profile Image  -------------------------->

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

        <!-------- POST Select button and Notifications icon ----------------->

        <div class="flex gap-10 m-t-10">
          <mat-form-field>
            <mat-label>Post</mat-label>
            <mat-select>
              <mat-option (click)="openImageUploadDialog(creatorId)"
                >Upload Image</mat-option
              >
              <mat-option (click)="openVideoUploadDialog(creatorId)"
                >Upload Video</mat-option
              >
            </mat-select>
          </mat-form-field>

          <mat-icon class="m-t-15 cursor" (click)="openNotifications()"
            >notifications</mat-icon
          >
        </div>
      </div>

      <!-------------------------- Profile Details --------------------------->

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

        <!---------------------------- Social Media Buttons ------------------------>

        <div class="flex gap-20">
          <img [src]="twitterUrl" alt="twitter" class="socialIcon" />

          <img [src]="instaUrl" alt="Insta" class="socialIcon" />

          <img [src]="tiktokUrl" alt="tiktok" class="socialIcon" />
        </div>
      </div>

      <!--------------------- Tab Groups of pictures and Videos ----------------------------->

      <div class="mat-tab-color mat-tab-ripple m-top-30">
        <mat-tab-group>
          <mat-tab>
            <ng-template mat-tab-label>
              <span class="custom-tab-label">Videos</span>
            </ng-template>

            <h2 style="text-align:center">Videos</h2>
            <ng-container *ngIf="!isVideoAsyncCall">
              <div class="video-grid">
                <div
                  class="video-container"
                  *ngFor="let video of videoDataArray"
                >
                  <div class="video-wrapper" (click)="expandVideo(video)">
                    <video
                      [src]="video.objectURL"
                      [title]="video.title"
                    ></video>
                    <div class="video-description">{{ video.description }}</div>
                  </div>
                </div>
              </div>
            </ng-container>

            <app-async-spinner *ngIf="isVideoAsyncCall"></app-async-spinner>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <span class="custom-tab-label">Pictures</span>
            </ng-template>

            <h2 style="text-align:center">Pictures</h2>

            <ng-container *ngIf="!isImageAsyncCall">
              <div style="margin-top:40px !important">
                <div class="image-grid">
                  <div
                    class="image-container"
                    *ngFor="let images of imageDataArray"
                  >
                    <img
                      [src]="images.objectURL"
                      [alt]="images.title"
                      (click)="expandImage(images)"
                    />
                    <div
                      class="expanded-view"
                      [ngClass]="{ active: expandedImage === images }"
                    >
                      <div class="image-details">
                        <img [src]="images.objectURL" class="expanded-image" />
                        <div class="details">
                          <div
                            class="close-button"
                            (click)="closeExpandedView()"
                          >
                            <i class="material-icons">close</i>
                          </div>

                          <h3 class="description">
                            Description: {{ images.description }}
                          </h3>

                          <div class="flex-container">
                            <!-- Your flex container with items -->
                            <div class="flex-item">
                              <div class="likes-section">
                                <i class="material-icons">favorite</i>
                                <p class="likes">Likes: {{ images.likes }}</p>
                              </div>

                              <!-- Your flex container with items -->

                              <div
                                class="likes-section"
                                style="margin-top:-20px"
                              >
                                <i
                                  class="material-icons"
                                  (click)="toggleComments()"
                                >
                                  {{ showComments ? 'close' : 'comment' }}
                                </i>
                                <p
                                  class="comments-heading"
                                  (click)="toggleComments()"
                                >
                                  Comments:
                                  {{ images.comments.length }}
                                </p>
                              </div>

                              <div
                                class="comments-section"
                                *ngIf="showComments"
                              >
                                <div
                                  *ngFor="let comment of images.comments"
                                  class="comment"
                                >
                                  <div
                                    class="comment-details"
                                    style="display:flex; justify-content:column"
                                  >
                                    <i class="material-icons">account_circle</i>
                                    <span class="username"
                                      >{{ comment.author }}:</span
                                    >
                                    <span class="user-comment">{{
                                      comment.text
                                    }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            mat-raised-button
                            style="background-color:#2aaa8a"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-container>

            <app-async-spinner *ngIf="isImageAsyncCall"></app-async-spinner>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
    <!-- </ng-container> -->
  `,
  styles: [
    `
      .home-container {
        padding: 0px 100px !important;
      }
      .custom-tab-label {
        color: white !important;
      }
      .mat-button {
        color: white !important;
        background-color: #1a1a1a !important;
        border: 1px solid white;
      }
      .mat-icon-label {
        margin-top: 4px;
      }
      .profile-picture {
        width: 150px;
        height: 150px;
        overflow: hidden;
        border-radius: 50%;
      }
      .profile-picture img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .profile-info {
        margin-top: -70px;
      }
      .profile-cover {
        margin: 0px !important;
        padding: 0px !important;
      }
      .socialIcon {
        cursor: pointer;
        width: 70px;
      }
      cursor: {
        cursor: pointer;
      }
      .image-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .image-container {
        flex: 1 1 calc(25% - 10px);
        position: relative;
        cursor: pointer;
      }

      .image-container img {
        width: 100%;
        height: 90%;
        display: block;
      }

      @media (max-width: 767px) {
        .image-container img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .expanded-view {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: auto;
      }

      .expanded-view.active {
        display: flex;
      }

      .image-details {
        background-color: black;
        width: 80%;
        height: 80%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        border: 1px solid #f1f1f1;
        border-radius: 20px;
      }

      .expanded-image {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: calc(70vh - 40px); /* Account for padding: 20px */
        object-fit: cover;
        margin-right: 20px;
      }

      .details {
        width: 30%;
        padding: 10px 0;
        box-sizing: border-box;
        overflow-y: auto;
      }

      @media (max-width: 767px) {
        .details {
          display: none;
        }
      }

      .comments-section {
        margin-top: 10px;
      }

      .comments-heading {
        font-weight: bold;
      }

      .comment {
        margin-bottom: 10px;
      }

      .comment p {
        margin: 5px 0;
      }

      .material-icons {
        font-size: 24px;
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
      }
      .flex-container {
        display: flex;
        /* Additional flexbox settings if required */
      }

      .flex-item {
        /* Adjust width, padding, margin, etc., as needed */
      }

      .likes-section,
      .comments-section {
        display: flex;
        align-items: center;
        margin-bottom: 1px; /* Optional margin between sections */
      }

      .likes-section .material-icons,
      .comments-section .material-icons {
        font-size: 24px;
        margin-right: 5px; /* Optional margin between icon and text */
      }
      .video-grid {
        display: flex;
        flex-wrap: wrap;
      }

      .video-container {
        width: 500px; /* Display four videos in a row */
        height: 200px !important;
        padding: 5px;
        box-sizing: border-box;
      }

      .video-wrapper {
        position: relative;
        cursor: pointer;
        height: 100%;
      }

      .video-description {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        padding: 8px;
        box-sizing: border-box;
        transition: height 0.3s ease-in-out; /* Smooth transition */
      }

      .video-wrapper.expanded .video-description {
        height: 20%; /* Expand description height when video is expanded */
      }

      .video-wrapper.expanded video {
        width: 100%; /* Expand video width when video is expanded */
        height: 80%; /* Expand video height when video is expanded */
      }
    `,
  ],
})
export class HomePageComponent implements OnInit {
  imageDataArray: any[] = [];
  videoDataArray: any[] = [];
  expandedImage: any = null;
  expandedVideo: any = null;

  ImageId: any;
  VideoId: any;
  isAsyncCall = false;
  isImageAsyncCall = false;
  isVideoAsyncCall = false;
  creatorId: any;
  // --------------- Profile details  --------------------
  userId: any;
  location: any;
  username: any;
  bio: any;
  joined: any;
  // bio = `Im a music artist, passionate about crafting soulful melodies that resonate with the heart. My music tells my story, taking you on a sonic journey through emotions and experiences. You can find me either performing live on stage or in the studio, where I bring my creative visions to life through sound.`;
  bioShortened = true;
  showReadMore = false;

  expandVideo(video: any) {
    this.expandedVideo = this.expandedVideo === video ? null : video;
  }

  // --------------- Profile and Cover Image URLs  --------------------

  coverImageUrl = 'assets/pictures/pic1.jpg';
  profileImageUrl = 'assets/pictures/pic1.jpg';
  @ViewChild('coverInput') coverInput?: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput?: ElementRef<HTMLInputElement>;

  // --------------- Social Media URLs  --------------------

  twitterUrl = 'assets/pictures/twitter.png';
  instaUrl = 'assets/pictures/insta.png';
  tiktokUrl = 'assets/pictures/tiktok.png';

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authensService: AuthenticationService,
    private snackbar: MatSnackBar
  ) {}

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
    this.getUploadImages();
    this.getUploadVideos();
    // this.deleteUploadedImages();
    // this.deleteUploadedVideos();
  }

  // --------------- Open Image Dialog  --------------------

  openImageUploadDialog(item: any) {
    const dialog = this.dialog.open(UploadImageDialogComponent, {
      data: {
        item,
      },
      width: '400px',
      height: '500px',
    });
  }

  // --------------- Open Video Dialog  --------------------

  openVideoUploadDialog(item: any) {
    const dialog = this.dialog.open(UploadVideoDialogComponent, {
      data: {
        item,
      },
      width: '400px',
      height: '500px',
    });
  }

  // --------------- Open Notifications Dialog  --------------------

  openNotifications() {
    const dialog = this.dialog.open(NotificationsDialogComponent, {
      width: '700px',
      height: '300px',
    });
  }

  // --------------- Edit Profile Dialog  --------------------

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

  // --------------- Cover Image Click --------------------

  onCoverImageClick() {
    if (this.coverInput) {
      this.coverInput.nativeElement.click();
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

  // --------------- Profile Image Click --------------------

  onProfileImageClick() {
    if (this.profileInput) {
      this.profileInput.nativeElement.click();
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

  // --------------- Get uploaded images --------------------

  // Function to convert Blob to Object URL
  blobToObjectURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  page = 1;
  pageSize = 12;

  // Update the getUploadImages function
  getUploadImages() {
    this.isImageAsyncCall = true;
    this.authensService
      .getUploadedImages(this.creatorId, this.page, this.pageSize)
      .subscribe((result: any) => {
        // Convert Base64 strings to Blobs
        result.result.forEach((image: any) => {
          const blob = this.base64toBlob(image.imageData, 'image/png');
          image.blobData = blob;
          image.objectURL = this.blobToObjectURL(blob); // Create Object URL from Blob
        });

        this.imageDataArray = result.result;
        this.isImageAsyncCall = false;
        console.log(result, 'res of images');
      });
  }

  // --------------- Get uploaded videos --------------------
  getUploadVideos() {
    this.isVideoAsyncCall = true;
    this.authensService
      .getUploadedVideos(this.creatorId, this.page, this.pageSize)
      .subscribe((res: any) => {
        if (res && res.result && res.result.length > 0) {
          res.result.forEach((video: any) => {
            const blob = this.base64toBlob(video.videoData, 'video/mp4');
            video.blobData = blob;

            // Adjust video dimensions here (e.g., reduce height and width by 50%)
            video.width = video.width * 0.25; // Adjust width
            video.height = video.height * 0.25; // Adjust height

            video.objectURL = this.blobToObjectURL(blob); // Create Object URL from Blob
          });
          this.videoDataArray = res.result;
        }
        this.isVideoAsyncCall = false;
        console.log(res, 'res of videos');
      });
  }

  // --------------- Deleted Images Api --------------------

  deleteUploadedImages() {
    this.isAsyncCall = true;
    this.authensService
      .deletedUploadedImages(this.creatorId, this.VideoId)
      .subscribe((res: any) => {
        if (res) {
          this.isAsyncCall = false;
          console.log(res, 'res of delete images');
        }
      });
  }

  // --------------- Deleted Videos Api --------------------

  deleteUploadedVideos() {
    this.isAsyncCall = true;
    this.authensService
      .deletedUploadedVideos(this.creatorId, this.ImageId)
      .subscribe((res: any) => {
        if (res) {
          this.imageDataArray = res;
          this.isAsyncCall = false;
          console.log(res, 'res of delete videos');
        }
      });
  }

  // ---------------Destroy session --------------------

  logout() {
    this.authensService.logout();
    this.logoutSnackbar();
  }

  // --------------- Logout SnackBar --------------------

  logoutSnackbar(): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`LOGGED OUT SUCCESSFULLY`, 'X', config);
  }

  // --------------- Expanded Images function --------------------

  expandImage(image: any) {
    this.expandedImage = this.expandedImage === image ? null : image;
  }

  closeExpandedView() {
    this.expandedImage = null;
  }
  showComments = false; // Flag to track comments visibility

  toggleComments(): void {
    this.showComments = !this.showComments; // Toggle comments visibility
  }

  // ---------------Function to convert Base64 to Blob -------------------------

  base64toBlob(base64Data: string, contentType: string = ''): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
}
