import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'projects/material/src/public-api';
import { CommonModule } from '@angular/common';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { NotificationsDialogComponent } from '../notifications-dialog/notifications-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadImageDialogComponent } from '../upload-image-dialog/upload-image-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AsyncSpinnerComponent } from '../async-spinner/async-spinner.component';
import { UploadVideoDialogComponent } from '../upload-video-dialog/upload-video-dialog.component';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AsyncSpinnerButtonComponent } from '../async-spinner-button/async-spinner-button.component';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CreatorPricingComponent } from '../creator-pricing/creator-pricing.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncSpinnerComponent,
    AsyncSpinnerButtonComponent,
  ],
  template: `
    <app-async-spinner *ngIf="isAsyncCall"></app-async-spinner>
    <ng-container *ngIf="!isAsyncCall">
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
            <button
              style="background-color:#2aaa8a;  color:white; font-weight:bold; border-radius:10px;  padding:28px 25px"
              mat-raised-button
              (click)="uploadPricing(creatorId)"
            >
              Pricing$
            </button>
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

            <mat-icon
              class="m-t-15 cursor"
              disabled="true"
              (click)="openNotifications()"
              >notifications</mat-icon
            >
          </div>
        </div>

        <!-------------------------- Profile Details --------------------------->

        <div class="m-b-10">
          <div class="flex gap-20">
            <h2>{{ username }}</h2>
            <mat-icon
              (click)="editProfileDialog(creatorId)"
              class="m-t-25 cursor"
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
              <label class="m-t-5">joined: {{ joined }}</label>
            </div>
          </div>
          <div style="width:40%">
            <p>
              {{ bioShortened ? bio?.slice(0, 50) + '...' : bio }}
              <button
                style="color:#2aaa8a"
                *ngIf="showReadMore"
                mat-button
                (click)="toggleBio()"
              >
                {{ bioShortened ? 'More Info' : 'Collapse Info' }}
              </button>
            </p>
          </div>

          <!---------------------------- Social Media Buttons ------------------------>

          <div class="flex gap-20">
            <a href="https://www.twitter.com">
              <img [src]="twitterUrl" alt="twitter" class="socialIcon"
            /></a>

            <a href="https://www.instagram.com">
              <img [src]="instaUrl" alt="Insta" class="socialIcon"
            /></a>

            <a href="https://www.tiktok.com">
              <img [src]="tiktokUrl" alt="tiktok" class="socialIcon"
            /></a>
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
                      <div class="video-description">
                        {{ video.description }}
                      </div>
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
                          <img
                            [src]="images.objectURL"
                            class="expanded-image"
                          />
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
                                      <i class="material-icons"
                                        >account_circle</i
                                      >
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
                            <!-- <button
                            mat-raised-button
                            style="background-color:#2aaa8a"
                          >
                            Delete
                          </button> -->

                            <app-async-spinner-button
                              [isAsyncCall]="isAsyncDeleteImageCall"
                              (click)="
                                deleteUploadedImages(images.imageId, creatorId)
                              "
                              >Delete</app-async-spinner-button
                            >
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
    </ng-container>
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
        height: 70%;
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
  isAsyncDeleteImageCall = false;
  creatorId: any;
  // --------------- Profile details  --------------------
  userId: any;
  location: any;
  username: any;
  bio: any;
  joined: any;
  bioShortened = true;
  showReadMore = false;
  payPalEmail: any;
  subscriptionPrice: any;

  expandVideo(video: any) {
    this.expandedVideo = this.expandedVideo === video ? null : video;
  }

  // --------------- Profile and Cover Image URLs  --------------------

  coverImageUrl: string | ArrayBuffer | null = 'assets/pictures/coverImage.jpg';
  profileImageUrl: string | ArrayBuffer | null =
    'assets/pictures/profilephoto.jpg';
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
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  toggleBio() {
    this.bioShortened = !this.bioShortened;
  }

  ngOnInit() {
    // Retrieve the userId and location from the URL query parameters
    this.route.paramMap.subscribe((params: any) => {
      this.creatorId = params.get('userId') || '';
    });

    this.getUploadImages();
    this.getUploadVideos();
    this.getPersonalInfo();
    this.getProfilePicture();
    this.getCoverPicture();
    // this.deleteUploadedImages();
    // this.deleteUploadedVideos();
  }

  // --------------- Open Image Dialog  --------------------

  openImageUploadDialog(item: any) {
    const dialog = this.dialog.open(UploadImageDialogComponent, {
      data: {
        item,
      },
      width: '450px',
      height: '500px',
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        console.log('response of images uplaoded', res);
        this.getUploadImages();
      }
    });
  }

  // --------------- Open Video Dialog  --------------------

  openVideoUploadDialog(item: any) {
    const dialog = this.dialog.open(UploadVideoDialogComponent, {
      data: {
        item,
      },
      width: '450px',
      height: '500px',
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        console.log('response of videos uplaoded', res);
        this.getUploadVideos();
      }
    });
  }

  // --------------- Open Notifications Dialog  --------------------

  openNotifications() {
    const dialog = this.dialog.open(NotificationsDialogComponent, {
      width: '700px',
      height: '400px',
    });
  }

  // --------------- Edit Profile Dialog  --------------------

  editProfileDialog(item: any) {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      data: {
        item: {
          userId: this.creatorId,
          name: this.username,
          location: this.location,
          bio: this.bio,
        },
      },
      width: '400px',
      height: '510px',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getPersonalInfo();
      }
    });
  }

  // --------------- Upload Pricing Dialog  --------------------

  uploadPricing(item: any) {
    const dialogRef = this.dialog.open(CreatorPricingComponent, {
      data: {
        item: {
          userId: this.creatorId,
          subscriptionPrice: this.subscriptionPrice,
          payPalEmail: this.payPalEmail,
        },
      },
      width: '400px',
      height: '460px',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.getPersonalInfo();
      }
    });
  }

  // ----------------- Get Personal Info Against specific Id  -------------------
  getPersonalInfo() {
    this.isAsyncCall = true;
    this.authensService.getPersonalInfo(this.creatorId).subscribe((res) => {
      if (res && res.result) {
        this.username = res.result.name;

        this.location = res.result.location;
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const date = new Date(res.result.dateOfBirth);
        const formattedDate =
          months[date.getMonth()] +
          ' ' +
          date.getDate() +
          ' ' +
          date.getFullYear();

        this.joined = formattedDate;
        this.bio = res.result.bio;
        if (this.bio && this.bio?.length > 50) {
          this.showReadMore = true;
        }
        this.isAsyncCall = false;
      }
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
      const userId = this.creatorId; // Replace with your actual user ID

      this.authensService.uploadCreatorCoverPicture(userId, file).subscribe(
        (res) => {
          if (res) {
            this.coverPictureSnackBar();
            this.coverImageUrl = URL.createObjectURL(file);
          }
        },
        (error) => {
          console.error('Error uploading image', error);
          this.coverPictureSnackBarError();
        }
      );

      // Rest of your code to handle updating the UI with the selected image
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
      const userId = this.creatorId; // Replace with your actual user ID

      this.authensService.uploadCreatorProfilePicture(userId, file).subscribe(
        (res) => {
          if (res) {
            this.profilePictureSnackBar();
            this.profileImageUrl = URL.createObjectURL(file);
          }
        },
        (error) => {
          console.error('Error uploading image', error);
          this.profilePictureSnackBarError();
        }
      );

      // Rest of your code to handle updating the UI with the selected image
    }
  }

  // --------------- Get Profile Image --------------------

  getProfilePicture() {
    const creatorId = this.creatorId; // Replace with your actual creator ID
    this.isAsyncCall = true;
    this.http
      .get('http://localhost:3000/v1/vidmo/userEssentials/getProfile', {
        params: { id: creatorId },
        responseType: 'arraybuffer', // Set the responseType to 'arraybuffer' to handle streamed data
        observe: 'response', // Use observe: 'response' to get the full response
      })
      .subscribe(
        (res: HttpResponse<any>) => {
          // Convert ArrayBuffer to base64 for image display
          const blob = new Blob([res.body], { type: 'image/jpeg' }); // Modify the type according to your image format
          const reader = new FileReader();

          reader.onload = () => {
            this.profileImageUrl = reader.result as string;
          };

          reader.readAsDataURL(blob);
          this.isAsyncCall = false;
        },
        (error) => {
          console.error('Error fetching profile image:', error);
          this.isAsyncCall = false;
        }
      );
  }

  // --------------- Get Cover Image --------------------

  getCoverPicture() {
    const creatorId = this.creatorId; // Replace with your actual creator ID
    this.isAsyncCall = true;
    this.http
      .get('http://localhost:3000/v1/vidmo/userEssentials/getCover', {
        params: { id: creatorId },
        responseType: 'arraybuffer', // Set the responseType to 'arraybuffer' to handle streamed data
        observe: 'response', // Use observe: 'response' to get the full response
      })
      .subscribe(
        (res: HttpResponse<any>) => {
          // Convert ArrayBuffer to base64 for image display
          const blob = new Blob([res.body], { type: 'image/jpeg' }); // Modify the type according to your image format
          const reader = new FileReader();

          reader.onload = () => {
            this.coverImageUrl = reader.result as string;
          };

          reader.readAsDataURL(blob);
          this.isAsyncCall = false;
        },
        (error) => {
          console.error('Error fetching cover image:', error);
          this.isAsyncCall = false;
        }
      );
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

  deleteUploadedImages(imageId: any, creatorId: any) {
    this.isAsyncDeleteImageCall = true;
    this.authensService
      .deletedUploadedImages(imageId, creatorId)
      .subscribe((res: any) => {
        if (res) {
          this.getUploadImages();
          this.imageDeleteSnackBar();
          this.isAsyncDeleteImageCall = false;
          this.expandImage(true);
        }
      });
  }

  // --------------- Deleted Videos Api --------------------

  deleteUploadedVideos() {
    this.isAsyncCall = true;
    this.authensService
      .deletedUploadedVideos(this.creatorId, this.VideoId)
      .subscribe((res: any) => {
        if (res) {
          this.imageDataArray = res;
          this.isAsyncCall = false;
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

  //-------------  Delete Image Snackbar  ---------------

  imageDeleteSnackBar() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`IMAGE DELETED SUCCESSFULY`, 'X', config);
  }

  //-------------  Profile Image Snackbar  ---------------

  profilePictureSnackBar() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`PROFILE PICTURE UPLOADED SUCCESSFULY`, 'X', config);
  }
  coverPictureSnackBar() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`COVER PHOTO UPLOADED SUCCESSFULY`, 'X', config);
  }
  profilePictureSnackBarError() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`ERROR IN UPLOADING FILE`, 'X', config);
  }
  coverPictureSnackBarError() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`ERROR IN UPLOADING FILE`, 'X', config);
  }
}
