import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'projects/material/src/public-api';
import { PaypalDialogComponent } from '../paypal-dialog/paypal-dialog.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { InjectableService } from '../../InjectableService';
import { delay, switchMap, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'app-user-home-page',
  standalone: true,
  imports: [MaterialModule, CommonModule, SearchBarComponent],
  template: `
    <!----------------------- Nav Bar --------------->

    <div class="container">
      <mat-toolbar color="primary">
        <mat-toolbar-row>
          <!-- Logo -->
          <div fxHide.lt-sm fxShow.gt-sm>
            <img src="assets/pictures/vinedo.png" alt="Logo" height="40px" />
          </div>
          <div fxHide.lt-sm fxShow.gt-sm class="spacer"></div>

          <!-- Logout Button -->
          <div>
            <button mat-icon-button (click)="logout()">
              <mat-icon style="color:white">logout</mat-icon>
            </button>
          </div>
        </mat-toolbar-row>
      </mat-toolbar>
    </div>

    <!----------------------- Cover Image --------------->

    <div class="profile-cover">
      <!-- Profile Cover Image -->
      <img
        [src]="coverImageUrl"
        alt="Profile Cover Image"
        style="width: 100%; height: 260px; overflow: hidden; object-fit: cover; "
      />
    </div>

    <!----------------------- Profile Image --------------->

    <div class="home-container">
      <div class="flex" style="justify-content:space-between">
        <div class="profile-info">
          <!-- Profile Picture -->
          <div class="profile-picture">
            <img [src]="profileImageUrl" alt="Profile-Picture" />
          </div>
        </div>

        <!-- Subscription and Content Request Buttons -->

        <div class="flex gap-10 m-t-10">
          <button class="mat-button" mat-raised-button (click)="paypalDialog()">
            Subscribe {{ this.subscriptionValue }}$ per month
          </button>
          <button mat-raised-button class="mat-button" [disabled]="true">
            Request Content
          </button>
        </div>
      </div>

      <!---------------- Profile Details ---------------->

      <div class="m-b-10">
        <div class="flex gap-20">
          <h2>{{ username }}</h2>
          <!-- <mat-icon (click)="editProfileDialog('')" class="m-t-20 cursor"
            >edit</mat-icon
          > -->
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
        <div class="width-read-more">
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

        <!-------------- Social Media Buttons -------------------->
        <div class="flex gap-20">
          <img [src]="twitterUrl" alt="twitter" class="socialIcon" />

          <img [src]="instaUrl" alt="Insta" class="socialIcon" />

          <img [src]="tiktokUrl" alt="tiktok" class="socialIcon" />
        </div>
      </div>

      <!---------------------------- Tab Group -------------------------->

      <div class="mat-tab-color mat-tab-ripple m-top-30">
        <mat-tab-group>
          <mat-tab>
            <ng-template mat-tab-label>
              <span class="custom-tab-label">Videos</span>
            </ng-template>

            <h2 style="text-align:center">Videos</h2>

            <button
              class="subscribe-btn mat-button"
              mat-raised-button
              (click)="paypalDialog()"
            >
              <mat-icon>lock</mat-icon>
              Subscribe to see Creator Videos
            </button>
          </mat-tab>
          <mat-tab>
            <ng-template mat-tab-label>
              <span class="custom-tab-label">Pictures</span>
            </ng-template>

            <h2 style="text-align:center">Pictures</h2>

            <ng-container *ngIf="imageErrorMessage">
              <button
                class="subscribe-btn mat-button"
                mat-raised-button
                (click)="paypalDialog()"
              >
                <mat-icon>lock</mat-icon>
                Subscribe to see Creator Pictures
              </button>
            </ng-container>

            <ng-container *ngIf="!imageErrorMessage">
              <h3 style="text-align:center">Welcome</h3>
              <!-- <div style="margin-top:40px !important">
              <div class="image-grid">
                <div class="image-container" *ngFor="let image of images">
                  <img [src]="image.url" (click)="expandImage(image)" />
                  <div
                    class="expanded-view"
                    [ngClass]="{ active: expandedImage === image }"
                  >
                    <div class="image-details">
                      <img [src]="image.url" class="expanded-image" />
                      <div class="details">
                        <div class="close-button" (click)="closeExpandedView()">
                          <i class="material-icons">close</i>
                        </div>

                        <p class="description">
                          Description: {{ image.description }}
                        </p>
                        <div class="flex-container">
                          <div class="flex-item">
                            <div class="likes-section">
                              <i class="material-icons">favorite</i>
                              <p class="likes">Likes: {{ image.likes }}</p>
                            </div>


                            <div class="likes-section">
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
                                {{ image.comments.length }}
                              </p>
                            </div>

                            <div class="comments-section" *ngIf="showComments">
                              <div
                                *ngFor="let comment of image.comments"
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            </ng-container>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [
    `
      .home-container {
        padding: 0px 100px !important;
      }
      @media (max-width: 767px) {
        .home-container {
          padding: 0px 10px !important;
        }
      }
      .width-read-more {
        width: 40%;
      }
      @media (max-width: 767px) {
        .width-read-more {
          width: 90%;
        }
      }
      .custom-tab-label {
        color: white !important;
      }
      .mat-button {
        background-color: #2aaa8a !important;
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
      .subscribe-btn {
        padding: 10px;
        display: block;
        margin: 0px auto;
        margin-top: 20px;
        margin-bottom: 20px;
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
        height: 60%;
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
        width: 70%;
        max-height: 70vh;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        border: 1px solid #f1f1f1;
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
    `,
  ],
})
export class UserHomePageComponent {
  images: any[] = []; // Placeholder for images from API
  expandedImage: any = null; // Track expanded image

  fetchImages() {
    // Simulate API call or add your API service call here
    // For demonstration, using dummy images
    this.images = [
      {
        url: 'assets/pictures/pic1.jpg',
        description: 'Image 1',
        likes: 10,
        comments: [
          { text: 'Nice!', author: 'User1' },
          { text: 'Great picture!', author: 'User2' },
          // Add more comments as needed
        ],
      },
      {
        url: 'assets/pictures/pic1.jpg',
        description: 'Image 1',
        likes: 10,
        comments: [
          { text: 'Nice!', author: 'User1' },
          { text: 'Great picture!', author: 'User2' },
          // Add more comments as needed
        ],
      },
      {
        url: 'https://via.placeholder.com/150',
        description: 'Image 1',
        likes: 10,
        comments: [
          { text: 'Nice!', author: 'User1' },
          { text: 'Great picture!', author: 'User2' },
          // Add more comments as needed
        ],
      },
      {
        url: 'https://via.placeholder.com/150',
        description: 'Image 1',
        likes: 10,
        comments: [
          { text: 'Nice!', author: 'User1' },
          { text: 'Great picture!', author: 'User2' },
          // Add more comments as needed
        ],
      },
    ];
  }

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
  isAsyncCall = false;
  creatorId: any;
  username: any;
  bio: any;
  joined: any;
  location: any;
  bioShortened = true;
  showReadMore = false;
  userId: any;
  paypalValue: any;
  subscriptionValue: any;
  subscriptionUid: any;
  imageDataArray: any[] = [];
  videoDataArray: any[] = [];
  videoId: any;

  twitterUrl = 'assets/pictures/twitter.png';
  instaUrl = 'assets/pictures/insta.png';
  tiktokUrl = 'assets/pictures/tiktok.png';

  coverImageUrl: string | ArrayBuffer | null = 'assets/pictures/coverImage.jpg';
  profileImageUrl: string | ArrayBuffer | null =
    'assets/pictures/profilephoto.jpg';
  @ViewChild('coverInput') coverInput?: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput?: ElementRef<HTMLInputElement>;

  constructor(
    private dialog: MatDialog,
    private authensService: AuthenticationService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private injectableService: InjectableService
  ) {}

  toggleBio() {
    this.bioShortened = !this.bioShortened;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.creatorId = params.get('userId') || '';
      this.userId = localStorage.getItem('_id');
    });

    this.getPricing();
    this.getPersonalInfo();
    this.getCoverPicture();
    this.getProfilePicture();
    this.fetchImages();

    this.injectableService.userId = this.userId;
    this.injectableService.creatorId = this.creatorId;
    this.injectableService.subscriptionUid = this.subscriptionUid;

    this.getUploadedImages();
    this.getUploadedVideosThumbNails();
    this.getUploadedVideosStream();
  }

  // -------------------Get Pricing------------------
  getPricing() {
    return this.authensService
      .getCreatorPricing(this.creatorId)
      .pipe(
        tap((res: any) => {
          console.log('Response from getCreatorPricing:', res);
          if (res && res.result && res.result.user) {
            this.subscriptionValue = res.result.user.subscriptionPrice;
            this.paypalValue = res.result.user.payPalEmail;
            this.subscriptionUid = res.result.user._id;
            console.log('subscriptionUid:', this.subscriptionUid);
          }
        })
      )
      .toPromise();
  }

  //---------------------------------------------------------
  paypalDialog() {
    const dialog = this.dialog.open(PaypalDialogComponent, {
      width: '410px',
      height: '420px',
    });
  }

  logout() {
    this.authensService.logout();
    this.logoutSnackbar();
  }
  logoutSnackbar(): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(`LOGGED OUT SUCCESSFULLY`, 'X', config);
  }

  videos = [
    {
      url: 'https://youtu.be/HFHl_tXSyaE?list=RDHFHl_tXSyaE', // Sample video URL
      description: 'Video 1 Description',
      likes: 15,
      comments: [
        { text: 'Comment 1 for Video 1', author: 'User A' },
        { text: 'Comment 2 for Video 1', author: 'User B' },
      ],
    },
    {
      url: 'https://www.example.com/video2.mp4', // Sample video URL
      description: 'Video 2 Description',
      likes: 10,
      comments: [
        { text: 'Comment 1 for Video 2', author: 'User X' },
        { text: 'Comment 2 for Video 2', author: 'User Y' },
        { text: 'Comment 3 for Video 2', author: 'User Z' },
      ],
    },
    // Add more dummy video data as needed
  ];
  expandedVideo: any; // Variable to store the expanded video

  expandVideo(video: any): void {
    this.expandedVideo = video;
  }

  closeExpandedVideo(): void {
    this.expandedVideo = null;
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
  // --------------- Get Profile Image --------------------

  getProfilePicture() {
    const creatorId = this.creatorId; // Replace with your actual creator ID

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
        },
        (error) => {
          console.error('Error fetching profile image:', error);
        }
      );
  }

  // --------------- Get Cover Image --------------------

  getCoverPicture() {
    const creatorId = this.creatorId; // Replace with your actual creator ID

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
        },
        (error) => {
          console.error('Error fetching cover image:', error);
        }
      );
  }

  // -------------Function to convert Blob to Object URL-----------------
  blobToObjectURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  // -------------------Get Uploaded Images on User Side------------------

  imageErrorMessage: any;
  page = 1;
  pageSize = 10;

  getUploadedImages() {
    this.isAsyncCall = true;
    const delayTime = 500;

    this.authensService
      .getImagesOnUserSide(
        this.userId,
        this.creatorId,
        this.subscriptionUid,
        this.page,
        this.pageSize
      )
      .pipe(delay(delayTime))
      .subscribe(
        (result: any) => {
          result.result.forEach((image: any) => {
            const blob = this.base64toBlob(image.imageData, 'image/png');
            image.blobData = blob;
            image.objectURL = this.blobToObjectURL(blob);
          });
          this.imageDataArray = result.result;
          this.isAsyncCall = false;
        },
        (error: any) => {
          if (error.status === 404) {
            this.imageErrorMessage =
              'Subscription Not Found, Please Subscribe Now.';
            this.isAsyncCall = false;
          }
        }
      );
  }

  // -------------------Get Uploaded Videos thumbnails on User Side------------------

  async getUploadedVideosThumbNails() {
    this.isAsyncCall = true;

    try {
      const result: any = await this.authensService
        .getVideosThumbnailsOnUserSide(
          this.creatorId,
          this.page,
          this.pageSize,
          this.userId,
          this.subscriptionUid
        )
        .toPromise();

      result.result.forEach((video: any) => {
        const blob = this.base64toBlob(video.videoData, 'video/mp4');
        video.blobData = blob;
        video.objectURL = this.blobToObjectURL(blob);
      });

      this.videoDataArray = result.result;
    } catch (error) {
      console.error('Error fetching video thumbnails:', error);
    } finally {
      this.isAsyncCall = false;
    }
  }

  // -------------------Get Uploaded Videos stream on User Side------------------

  getUploadedVideosStream(): void {
    this.isAsyncCall = true;
    this.authensService
      .getVideosStreamOnUserSide(
        this.userId,
        this.creatorId,
        this.subscriptionUid,
        this.videoId
      )
      .subscribe(
        (result: any) => {
          this.videoDataArray = result.result;
          this.isAsyncCall = false;

          // Process the videoDataArray if needed
          this.videoDataArray.forEach((video: any) => {
            // Process each video...
          });
        },
        (error: any) => {
          // Handle errors here
          console.error('Error fetching video streams:', error);
          this.isAsyncCall = false;
        }
      );
  }

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
