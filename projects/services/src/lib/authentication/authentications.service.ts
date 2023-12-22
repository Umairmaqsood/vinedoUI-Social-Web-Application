import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequestData } from 'src/app/authentication';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Axios } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private backendUrl = 'http://localhost:3000/v1/vidmo';

  constructor(
    private http: HttpClient // private currentUserSubject: BehaviorSubject<any>, // public currentUser: Observable<any>
  ) {}

  // Example method to fetch data from the backend
  login(data: LoginRequestData) {
    return this.http.post<any[]>(this.backendUrl + '/auth/login', data);
  }

  signup(data: any) {
    return this.http.post<any[]>(this.backendUrl + '/auth/register', data);
  }
}
