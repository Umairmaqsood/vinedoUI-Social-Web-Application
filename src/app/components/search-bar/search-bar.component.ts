import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'projects/material/src/public-api';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  template: `
    <div class="container">
      <mat-toolbar color="primary">
        <mat-toolbar-row>
          <div fxHide.lt-sm fxShow.gt-sm>
            <!-- Logo -->
            <img src="assets/pictures/vinedo.png" alt="Logo" height="40px" />
          </div>
          <div fxHide.lt-sm fxShow.gt-sm class="spacer"></div>
          <div class="search-container">
            <!-- Search Input -->
            <mat-form-field class="search-field">
              <input matInput placeholder="Search" />
              <button mat-button matSuffix>
                <mat-icon>search</mat-icon>
              </button>
            </mat-form-field>
          </div>
          <div class="spacer"></div>
          <div>
            <!-- Logout Button -->
            <button mat-icon-button (click)="logout()">
              <mat-icon style="color:white">logout</mat-icon>
            </button>
          </div>
        </mat-toolbar-row>
      </mat-toolbar>
    </div>
  `,
  styles: [],
})
export class SearchBarComponent {
  constructor(private authensService: AuthenticationService) {}
  logout() {
    console.log('Logged out');
    this.authensService.logout();
  }
}
