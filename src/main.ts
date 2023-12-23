import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
// import { environment } from './environments/environment';
// import { AuthGuard, ErrorInterceptor, HttpConfigInterceptor } from '@berd/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app/app.component';
import { AUTH_ROUTE } from './app/authentication/route';
import { COMP_ROUTE } from './app/components';
import { ToastrModule } from 'ngx-toastr'; // Import ngx-toastr
import { BehaviorSubject } from 'rxjs';

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

// if (environment.production) {
//   enableProdMode();
// }
const routes: Routes = [
  {
    path: '',
    children: AUTH_ROUTE,
  },

  // {
  //   path: '',
  //   children: COMP_ROUTE,
  // },

  // {
  //   path: '',
  //   canActivateChild: [AuthGuard],
  //   loadComponent: () =>
  //     import('@berd/layout').then((component) => component.SidebarComponent),
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () =>
  //         import('@berd/layout').then((component) => component.SIDEBAR_ROUTES),
  //     },
  //   ],
  // },
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes),
      BehaviorSubject,
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      MatSnackBarModule,
      MatDialogModule,
      ToastrModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        progressBar: true,

        toastClass: 'ngx-toastr custom-toast',
      })
    ),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpConfigInterceptor,
    //   multi: true,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ErrorInterceptor,
    //   multi: true,
    // },
  ],
}).catch((err) => console.error(err));
