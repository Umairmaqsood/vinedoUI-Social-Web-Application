import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private backendUrl = 'http://localhost:3000/v1/vidmo/';

  constructor(private http: HttpClient) {}

  // Example method to fetch data from the backend
  login(data: any) {
    return this.http.post<any[]>(this.backendUrl + '/auth/login', data); // Replace 'endpoint' with your actual API endpoint
  }
}
