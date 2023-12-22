import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRequestData } from 'src/app/authentication';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private backendUrl = 'http://localhost:3000/v1/vidmo';

  // Define static properties
  private static authToken: string | null = null;
  private static authClaims: any | null = null;

  constructor(private http: HttpClient) {}

  login(data: LoginRequestData): Observable<void> {
    return this.http.post<any>(this.backendUrl + '/auth/login', data).pipe(
      map((response) => {
        if (response && response.result) {
          AuthenticationService.authToken = response.result;
          AuthenticationService.authClaims = this.decodeTokenClaims(
            response.result
          );
        }
      })
    );
  }

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

  logout(): void {
    AuthenticationService.authToken = null;
    AuthenticationService.authClaims = null;
    localStorage.removeItem('userToken');
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
}
