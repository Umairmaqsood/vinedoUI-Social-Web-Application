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

  { path: 'home-page/:userId', component: HomePageComponent },

  {
    path: 'user-home-page/:userId', // Include userId in the user-home-page route
    component: UserHomePageComponent,
  },
  {
    path: 'news-feed/:userId',
    component: NewsFeedComponent,
  },
];
