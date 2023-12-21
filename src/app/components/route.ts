import { Route } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';

export const COMP_ROUTE: Route[] = [
  {
    path: '',
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
