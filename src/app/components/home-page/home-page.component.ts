import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'projects/material/src/public-api';
import { CommonModule } from '@angular/common';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { NotificationsDialogComponent } from '../notifications-dialog/notifications-dialog.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UploadImageDialogComponent } from '../upload-image-dialog/upload-image-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AsyncSpinnerComponent } from '../async-spinner/async-spinner.component';
import { UploadVideoDialogComponent } from '../upload-video-dialog/upload-video-dialog.component';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AsyncSpinnerButtonComponent } from '../async-spinner-button/async-spinner-button.component';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CreatorPricingComponent } from '../creator-pricing/creator-pricing.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';

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
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
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
              <div *ngIf="videoDataArray.length > 0">
                <h2>Video Thumbnails</h2>
                <div class="thumbnail-gallery">
                  <div *ngFor="let video of videoDataArray">
                    <div class="video-item">
                      <img
                        [src]="video.url"
                        alt="Thumbnail"
                        width="320"
                        height="240"
                        (error)="handleImageError($event)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="videoDataArray.length === 0">
                <!-- Show a message if there are no videos -->
                <p>No videos available.</p>
              </div>

              <div class="video-player-container">
                <h3>Vinedo Player</h3>
                <vg-player>
                  <vg-overlay-play></vg-overlay-play>
                  <vg-buffering></vg-buffering>

                  <vg-scrub-bar>
                    <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
                    <vg-scrub-bar-buffering-time></vg-scrub-bar-buffering-time>
                    <div
                      class="custom-progress-bar"
                      [style.width.%]="getProgressBarWidth()"
                    >
                      <div class="progress"></div>
                    </div>
                  </vg-scrub-bar>

                  <vg-controls style="color: aliceblue;">
                    <vg-play-pause></vg-play-pause>
                    <vg-playback-button></vg-playback-button>
                    <vg-time-display
                      vgProperty="current"
                      vgFormat="mm:ss"
                    ></vg-time-display>
                    <vg-scrub-bar style="flex: 1;"></vg-scrub-bar>
                    <vg-time-display
                      vgProperty="total"
                      vgFormat="mm:ss"
                    ></vg-time-display>
                    <vg-track-selector></vg-track-selector>
                    <vg-mute></vg-mute>
                    <vg-volume></vg-volume>
                    <vg-fullscreen></vg-fullscreen>
                  </vg-controls>

                  <video
                    [vgMedia]="$any(media)"
                    #media
                    id="singleVideo"
                    preload="auto"
                    crossorigin
                  >
                    <source src="../../../assets/test.mp4" type="video/mp4" />
                    <track
                      kind="subtitles"
                      label="English"
                      src="http://static.videogular.com/assets/subs/pale-blue-dot.vtt"
                      srclang="en"
                      default
                    />
                  </video>
                </vg-player>
              </div>

              <!-- ----------------- -->
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
                        width="320"
                        height="240"
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

                            <label style="background-color:#2aaa8a">
                              Description: {{ images.description }}
                            </label>

                            <div class="flex-container">
                              <div class="flex-item">
                                <div class="likes-section">
                                  <i class="material-icons">favorite</i>
                                  <p class="likes">Likes: {{ images.likes }}</p>
                                </div>

                                <div *ngFor="let comment of images.comments">
                                  <div class="flex">
                                    <mat-icon>person_pin</mat-icon>
                                    <b>{{ comment.userIdName }}</b>
                                  </div>
                                  <label style="margin-left:22px">
                                    {{ comment.comment }}
                                  </label>
                                </div>

                                <form [formGroup]="postComments">
                                  <div class="flex gap-10">
                                    <mat-form-field appearance="outline">
                                      <mat-label>Comment</mat-label>

                                      <input
                                        matInput
                                        formControlName="inputComment"
                                        placeholder="Add Comment"
                                      />
                                    </mat-form-field>

                                    <mat-icon
                                      class="m-t-10"
                                      (click)="postComment(images.imageId)"
                                    >
                                      send
                                    </mat-icon>
                                  </div>
                                </form>
                              </div>
                            </div>

                            <div>
                              <app-async-spinner-button
                                [isAsyncCall]="isAsyncDeleteImageCall"
                                (click)="
                                  deleteUploadedImages(
                                    images.imageId,
                                    creatorId
                                  )
                                "
                                >Delete Picture</app-async-spinner-button
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div *ngIf="imageDataArray.length === 0">
                
                  <p>No Images available.</p>
                </div> -->
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
        min-width: 70%;
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
        width: 90%;
        height: 90%;
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
        object-fit: contain;
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

      .video-player-container {
        display: block;
        max-width: 800px;
        margin: 0 auto;
        border-radius: 10px;
        overflow: hidden;
      }

      h3 {
        font-size: 1.5rem;
        color: #575555;
      }

      vg-player {
        position: relative;
        max-width: 100%;
        margin-top: 20px;
      }

      video {
        width: 100%;
      }

      vg-controls {
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      vg-controls button {
        display: inline-block;
        background-color: transparent;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        margin: 0 5px;
        transition: opacity 0.3s;
      }

      vg-controls button:hover {
        opacity: 0.7;
      }

      vg-scrub-bar {
        width: 100%;
        margin-top: 10px;
      }

      .custom-progress-bar {
        position: absolute;
        height: 5px;
        background-color: #3498db;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .progress {
        height: 100%;
        background-color: #2c3e50;
      }
    `,
  ],
})
export class HomePageComponent implements OnInit {
  imageDataArray: any[] = [];
  videoDataArray: any[] = [];
  expandedImage: any = null;
  expandedVideo: any = null;
  imageId: any;
  videoId: any;
  isAsyncCall = false;
  isImageAsyncCall = false;
  isVideoAsyncCall = false;
  isAsyncDeleteImageCall = false;
  creatorId: any;
  userComment: any;
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
  userIdName: any;
  comment: any;
  uid: any;
  @ViewChild('media') media: any;

  getProgressBarWidth(): number {
    const currentTime = this.media?.currentTime || 0;
    const totalDuration = this.media?.duration || 1;
    return (currentTime / totalDuration) * 100;
  }

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
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {}

  postComments = this.formBuilder.group({
    inputComment: [undefined as any, Validators.required],
  });

  get inputComment() {
    return this.postComments.controls.inputComment;
  }

  toggleBio() {
    this.bioShortened = !this.bioShortened;
  }

  async ngOnInit() {
    // Retrieve the userId and location from the URL query parameters
    this.route.paramMap.subscribe((params: any) => {
      this.creatorId = params.get('userId') || '';
    });

    this.uid = await localStorage.getItem('_id');

    this.getUploadImages();
    this.getUploadVideosThumbnails();
    this.getPersonalInfo();
    this.getProfilePicture();
    this.getCoverPicture();
    this.getCommentOnImages(this.imageId);

    // this.getUploadImagesWithComments();
    // this.deleteUploadedImages();
    // this.deleteUploadedVideos();
  }

  // --------------- Open Image Dialog  --------------------

  openImageUploadDialog(item: any) {
    const dialog = this.dialog.open(UploadImageDialogComponent, {
      data: {
        item,
      },
      minWidth: '450px',
      minHeight: '500px',
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        console.log('response of images uplaoded', res);
        this.getUploadImages();
      } else {
        this.isAsyncCall = false;
      }
    });
  }

  handleImageError(event: Event) {
    // Log an error if the image fails to load
    console.error('Image failed to load:', event);
  }

  // --------------- Open Video Dialog  --------------------

  openVideoUploadDialog(item: any) {
    const dialog = this.dialog.open(UploadVideoDialogComponent, {
      data: {
        item,
      },
      minWidth: '450px',
      minHeight: '500px',
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        console.log('response of videos uplaoded', res);
        this.getUploadVideosThumbnails();
      } else {
        this.isAsyncCall = false;
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
      } else {
        this.isAsyncCall = false;
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
        const date = new Date(res.result.createdAt);
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

          // Fetch comments for each image
          this.authensService
            .getCommentsOnImages(image.imageId, this.page, this.pageSize)
            .subscribe(
              (commentResult: any) => {
                image.comments = commentResult.data.comments;
              },
              (error) => {
                console.error('Error fetching comments:', error);
              }
            );
        });

        this.imageDataArray = result.result;
        console.log(this.imageDataArray, 'imagedataarray');
        this.isImageAsyncCall = false;
      });
  }

  // --------------- Get uploaded videos --------------------

  getUploadVideosThumbnails() {
    this.isAsyncCall = true;
    this.authensService
      .getUploadedVideosThumbnails(this.videoId, this.creatorId)
      .subscribe({
        next: (blob: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageUrl = reader.result as string;
            this.videoDataArray.push({ thumbnailUrl: imageUrl });
          };
          reader.readAsDataURL(blob); // Convert Blob to base64
        },
        error: (error: any) => {
          console.error('Error retrieving videos:', error);
          this.isAsyncCall = false;
        },
        complete: () => {
          this.isAsyncCall = false;
        },
      });
  }

  // --------------- Get uploaded single videos --------------------
  getUploadSingleVideos() {
    // this.isVideoAsyncCall = true;
    // this.authensService
    //   .getUploadedSingleVideos(this.creatorId, this.videoId)
    //   .subscribe((res: any) => {
    //     if (res && res.result && res.result.length > 0) {
    //       res.result.forEach((video: any) => {
    //         const blob = this.base64toBlob(video.videoData, 'video/mp4');
    //         video.blobData = blob;
    //         video.objectURL = this.blobToObjectURL(blob); // Create Object URL from Blob
    //       });
    //       this.videoDataArray = res.result;
    //     }
    //     this.isVideoAsyncCall = false;
    //     console.log(res, 'res of single videos');
    //   });
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
        } else {
          this.isAsyncCall = false;
          this.error();
        }
      });
  }

  // --------------- Deleted Videos Api --------------------

  deleteUploadedVideos(videoId: any, creatorId: any) {
    this.isAsyncCall = true;
    this.authensService
      .deletedUploadedVideos(videoId, creatorId)
      .subscribe((res: any) => {
        if (res) {
          this.videoDataArray = res;
          this.isAsyncCall = false;
          this.videoDeleteSnackBar();
        } else {
          this.ErrorInDeletingVideos();
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
  videoDeleteSnackBar() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`VIDEO DELETED SUCCESSFULY`, 'X', config);
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
  ErrorInDeletingVideos() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`AN ERROR OCCURED DURING DELETING`, 'X', config);
  }

  error(): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`AN ERROR OCCURED`, 'X', config);
  }

  getCommentOnImages(imageId: string) {
    this.isAsyncCall = false;
    this.authensService
      .getCommentsOnImages(imageId, this.page, this.pageSize)
      .subscribe((res) => {
        console.log(res, 'responseofgetcomments');
        this.isAsyncCall = false;
      });
  }

  // Post Comment

  postComment(imageId: string) {
    const data = {
      userComment: this.inputComment.value,
    };
    this.isAsyncCall = false;
    this.authensService
      .postCommentsOnImages(data.userComment, imageId, this.uid)
      .subscribe((res) => {
        if (res) {
          this.getCommentOnImages(imageId);
          this.commentSnackBar();
          this.isAsyncCall = false;
        } else {
          this.isAsyncCall = false;
        }
      });
  }

  commentSnackBar() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`COMMENTS POSTED SUCCESSFULY`, 'X', config);
  }
}
