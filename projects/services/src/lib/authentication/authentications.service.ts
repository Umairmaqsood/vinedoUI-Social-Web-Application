import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, range } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRequestData } from 'src/app/authentication';
import {
  HttpBackend,
  HttpClient,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private backendUrl = 'http://localhost:3000/v1/vidmo';

  // Define static properties
  private static authToken: string | null = null;
  private static authClaims: any | null = null;

  // Behavior Subject to hold current user information
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Retrieving stored user from localStorage and initializing the Behavior Subject
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserSubject.next(storedUser);
  }

  // Getters for current user value and data
  public get currentUserValue(): any {
    return this.currentUserSubject?.value;
  }
  public get currentUserData(): any {
    return this.currentUserSubject?.value?.user;
  }

  login(loginData: LoginRequestData) {
    return this.http.post<any>(`${this.backendUrl}/auth/login`, loginData).pipe(
      map((loginResponse: any) => {
        if (loginResponse && loginResponse.userToken) {
          // Decode the received token
          const decodedToken: any = jwtDecode(loginResponse.userToken);

          console.log('decodedtoken', decodedToken);

          // Extract and store specific data from the token in localStorage
          localStorage.setItem('userEmail', decodedToken.email || '');
          localStorage.setItem(
            'userDateOfBirth',
            decodedToken.dateOfBirth || ''
          );
          localStorage.setItem(
            'userPhoneNumber',
            decodedToken.phoneNumber || ''
          );
          localStorage.setItem('userCreated', decodedToken.createdAt || '');
          localStorage.setItem('userName', decodedToken.name || '');
          localStorage.setItem('userBio', decodedToken.bio || '');
          localStorage.setItem('userLocation', decodedToken.location || '');
          localStorage.setItem('_id', decodedToken._id || '');
          console.log(localStorage.getItem('_id'), 'My Id');

          localStorage.setItem(
            'isContentCreator',
            String(decodedToken.isContentCreator || false)
          );

          // Store the entire response in 'currentUser' (if required)
          localStorage.setItem('currentUser', JSON.stringify(loginResponse));

          // Update the currentUserSubject (if needed)
          this.currentUserSubject.next(loginResponse);

          return loginResponse;
        } else {
          // Handle the case when there is no userToken in the response
          return null;
        }
      })
    );
  }

  signup(data: any) {
    return this.http.post<any>(this.backendUrl + '/auth/register', data);
  }

  forgotPassword(email: any) {
    return this.http.post<any[]>(this.backendUrl + `/auth/forgetPassword`, {
      email,
    });
  }
  otpValidation(email: string, otp: any) {
    return this.http.post<any[]>(`${this.backendUrl}/auth/verifyOTP`, {
      email,
      otp,
    });
  }
  confirmPassword(email: string, password: string, confirmPassword: string) {
    return this.http.post<any[]>(`${this.backendUrl}/auth/updatePassword`, {
      email,
      password,
      confirmPassword,
    });
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('');
  }

  uploadImage(
    title: string,
    description: string,
    creatorId: string,
    file: File
  ) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('creatorId', creatorId);
    formData.append('Image', file);

    // Retrieve user's token from local storage and parse it as an object
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.post<any>(
      `${this.backendUrl}/uploadFile/Image`,
      formData,
      headers
    );
  }

  uploadVideo(
    title: string,
    description: string,
    creatorId: string,
    file: File
  ) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('creatorId', creatorId);
    formData.append('Video', file);

    // Retrieve user's token from local storage and parse it as an object
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.post<any>(
      `${this.backendUrl}/uploadFile/Video`,
      formData,
      headers
    );
  }
  //==============================Get Images Uploaded=====================================

  getUploadedImages(creatorId: string, page: number, pageSize: number) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.get<any>(
      this.backendUrl +
        `/image/getImages_Creator/${creatorId}?page=${page}&pageSize=${pageSize}`,
      headers
    );
  }
  //==============================Get Video Thumbnails=====================================
  getUploadedVideosThumbnails(
    videoId: string,
    creatorId: string
  ): Observable<Blob> {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set headers with the access token
    const headers = new HttpHeaders().set('x-access-token', userToken || '');
    const options = {
      headers: headers,
      responseType: 'blob' as 'json', // Ensure responseType is set to 'blob'
    };

    // Data payload to send to the backend
    const data = {
      videoId: videoId, // Ensure videoId is included in the payload
      creatorId: creatorId,
    };

    // Make a POST request to the backend API
    return this.http.post<Blob>(
      this.backendUrl + `/video/getVideoThumbnails_Creator`,
      data,
      options
    );
  }

  //===========================================================================================

  deletedUploadedImages(imageId: string, creatorId: string) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const body = {
      ImageId: imageId,
      creatorId: creatorId,
    };

    return this.http.post<any>(
      this.backendUrl + '/deleteFile/Image',
      body,
      headers
    );
  }
  deletedUploadedVideos(videoId: string, creatorId: string) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const body = {
      videoId: videoId,
      CreatorId: creatorId,
    };

    return this.http.post<any>(
      this.backendUrl + '/deleteFile/Video',
      body,
      headers
    );
  }

  updatePersonalInfo(
    userId: string,
    name: string,
    location: string,
    bio: string
  ) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const data = {
      userId,
      name,
      location,
      bio,
    };

    return this.http.post<any>(
      this.backendUrl + '/auth/updatePersonalInfo',
      data,
      headers
    );
  }

  getPersonalInfo(userId: string) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.get<any>(
      this.backendUrl + `/auth/getPersonalInfo?userId=${userId}`,
      headers
    );
  }

  searchCreatorInfo(name: string, page: number, pageSize: number) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const data = {
      name,
      page,
      pageSize,
    };

    return this.http.post<any>(
      this.backendUrl + `/subscription/SearchCreator`,
      data,
      headers
    );
  }

  uploadCreatorProfilePicture(userId: string, file: File) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const formData = new FormData();
    formData.append('id', userId);
    formData.append('Avatar', file);

    return this.http.post<any>(
      this.backendUrl + '/uploadFile/Avatar',
      formData,
      headers
    );
  }
  uploadCreatorCoverPicture(userId: string, file: File) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const formData = new FormData();
    formData.append('id', userId);
    formData.append('Avatar', file);

    return this.http.post<any>(
      this.backendUrl + '/uploadFile/Cover',
      formData,
      headers
    );
  }

  getProfilePicture(id: string) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.get<any>(
      this.backendUrl + `/userEssentials/getProfile?id=${id}`,
      headers
    );
  }

  getCoverPicture(id: string) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.get<any>(
      this.backendUrl + `/userEssentials/getCover?id=${id}`,
      headers
    );
  }

  uploadCreatorPricing(
    creatorId: string,
    subscriptionPrice: number,
    payPalEmail: string
  ) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const data = {
      creatorId,
      subscriptionPrice,
      payPalEmail,
    };
    return this.http.post<any>(
      this.backendUrl + `/subscription/setSubscriptionDetails`,
      data,
      headers
    );
  }

  getCreatorPricing(id: string) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.get<any>(
      this.backendUrl + `/userEssentials/accountDetails?id=${id}`,
      headers
    );
  }

  payNormalAmount(userId: string, creatorId: string, subscriptionId: string) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;
    const data = {
      userId,
      creatorId,
      subscriptionId,
    };
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.post<any>(
      this.backendUrl + `/subscription/payNormalAmount`,
      data,
      headers
    );
  }

  getImagesOnUserSide(
    userId: string,
    creatorId: string,
    subscriptionId: string,
    page: number,
    pageSize: number
  ) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    console.log(subscriptionId, 'Is here find it');
    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const data = {
      userId,
      creatorId,
      subscriptionId,
      page,
      pageSize,
    };
    return this.http.post<any>(
      this.backendUrl + `/content/getImages_User`,
      data,
      headers
    );
  }

  getVideosThumbnailsOnUserSide(
    creatorId: string,
    page: number,
    pageSize: number,
    userId: string,
    subscriptionId: string
  ) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const data = {
      creatorId,
      page,
      pageSize,
      userId,
      subscriptionId,
    };
    return this.http.post<any>(
      this.backendUrl + `/content/getVideosThumbnails_User`,
      data,
      headers
    );
  }

  getVideosStreamOnUserSide(
    userId: string,
    creatorId: string,
    subscriptionId: string,
    videoId: string,
    range?: string
  ) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    const headers = new HttpHeaders({
      'x-access-token': userToken || '',
      Range: range || '',
    });

    const data = {
      userId,
      creatorId,
      subscriptionId,
      videoId,
    };

    return this.http.post<any>(
      this.backendUrl + `/content/getVideoStream_User`,
      data,
      { headers }
    );
  }

  postCommentsOnImages(userComment: string, imageId: string, userId: string) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const data = {
      userComment,
      imageId,
      userId,
    };

    return this.http.post<any>(
      this.backendUrl + `/image/postComments`,
      data,
      headers
    );
  }

  getCommentsOnImages(imageId: any, page: number, pageSize: number) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const data = {
      imageId,
      page,
      pageSize,
    };

    return this.http.post<any>(
      this.backendUrl + `/images/getAllComments`,
      data,
      headers
    );
  }
}
