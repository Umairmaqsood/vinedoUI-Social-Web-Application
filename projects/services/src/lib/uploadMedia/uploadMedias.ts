import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class uploadMediaService {
  constructor(private http: HttpClient) {}
  private backendUrl = 'http://localhost:3000/v1/vidmo';

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
    formData.append('imageFile', file); // Assuming the field name in backend is 'imageFile'

    // Retrieve user's token from local storage and parse it as an object
    const currentUser = localStorage.getItem('currentUser');
    const userToken = currentUser ? JSON.parse(currentUser).userToken : null;

    // Set the token in the Authorization header
    const headers = new HttpHeaders().set(
      'Headers',
      `x-access-token ${userToken}`
    );

    return this.http.post<any>(
      `${this.backendUrl}/uploadFile/image`,
      formData,
      { headers }
    );
  }
}
