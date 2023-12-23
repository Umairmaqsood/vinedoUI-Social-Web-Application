import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRequestData } from 'src/app/authentication';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private publicHttp: HttpClient, // Might not be needed, considering it's re-assigned below
    private handler: HttpBackend // Might not be needed, considering it's re-assigned below
  ) {
    // Retrieving stored user from localStorage and initializing the Behavior Subject
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserSubject.next(storedUser);

    // Re-initializing the publicHttp and currentUserSubject which may not be necessary due to previous initialization
    // this.publicHttp = new HttpClient(this.handler);
    // this.currentUserSubject = new BehaviorSubject<any>(
    //   JSON.parse(localStorage.getItem('currentUser') as string)
    // );
    // this.currentUser = this.currentUserSubject?.asObservable();
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

          console.log(decodedToken, 'decodedtoken');

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

  // login(data: LoginRequestData): Observable<void> {
  //   return this.http.post<any>(this.backendUrl + '/auth/login', data);
  //   // .pipe(
  //   //   map((response) => {
  //   //     if (response && response.result) {
  //   //       AuthenticationService.authToken = response.result;
  //   //       AuthenticationService.authClaims = this.decodeTokenClaims(
  //   //         response.result
  //   //       );
  //   //     }
  //   //   })
  //   // );
  // }

  private decodeTokenClaims(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  static getAuthClaims(): any | null {
    return AuthenticationService.authClaims;
  }

  static getUserId(): string | null {
    const claims = AuthenticationService.authClaims;
    console.log(claims._id);
    return claims ? claims._id : null;
  }

  // logout(): void {
  //   AuthenticationService.authToken = null;
  //   AuthenticationService.authClaims = null;
  //   localStorage.removeItem('userToken');
  // }

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
    console.log(userToken);
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
    console.log(userToken);
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.post<any>(
      `${this.backendUrl}/uploadFile/Video`,
      formData,
      headers
    );
  }

  getUploadedImages(creatorId: string, page: number, pageSize: number) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    console.log(userToken);
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.get<any>(
      this.backendUrl +
        `/image/getImages_Creator/${creatorId}?page=${page}&pageSize=${pageSize}`,
      headers
    );
  }

  getUploadedVideos(creatorId: string, page: number, pageSize: number) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    console.log(userToken);
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    return this.http.get<any>(
      this.backendUrl +
        `/image/getVideo_Creator/${creatorId}?page=${page}&pageSize=${pageSize}`,
      headers
    );
  }

  deletedUploadedImages(ImageId: string, creatorId: string) {
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = {
      headers: new HttpHeaders().set('x-access-token', userToken || ''),
    };

    const body = {
      ImageId: ImageId,
      CreatorId: creatorId,
    };

    return this.http.post<any>(
      this.backendUrl + 'deleteFile/Image',
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
}
