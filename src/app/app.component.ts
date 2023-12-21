import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UserHomePageComponent } from './components/user-home-page/user-home-page.component';
import { LoginComponent } from './authentication/login/login.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { SignUpComponent } from './authentication/signup/signup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    HomePageComponent,
    UserHomePageComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    RouterModule,
  ],
})
export class AppComponent {}
