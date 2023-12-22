import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {
  HomePageComponent,
  NewsFeedComponent,
  UserHomePageComponent,
} from '../components';

export const AUTH_ROUTE: Route[] = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'home-page',
    component: HomePageComponent,
  },
  {
    path: 'user-home-page',
    component: UserHomePageComponent,
  },
  {
    path: 'news-feed',
    component: NewsFeedComponent,
  },
];
