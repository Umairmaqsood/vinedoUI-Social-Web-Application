import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MaterialModule } from 'projects/material/src/public-api';
import { AuthenticationService } from 'projects/services/src/lib/authentication/authentications.service';
import { AsyncSpinnerComponent } from '../async-spinner/async-spinner.component';
import { FormControl, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    AsyncSpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="container">
      <mat-toolbar color="primary">
        <mat-toolbar-row>
          <!-- Logo -->
          <div fxHide.lt-sm fxShow.gt-sm>
            <img src="assets/pictures/vinedo.png" alt="Logo" height="40px" />
          </div>
          <div fxHide.lt-sm fxShow.gt-sm class="spacer"></div>
          <div class="search-container">
            <mat-form-field class="search-field">
              <input
                matInput
                placeholder="Search"
                [formControl]="searchControl"
                [matAutocomplete]="auto"
              />
              <mat-icon matSuffix>search</mat-icon>
              <mat-autocomplete #auto="matAutocomplete">
                <mat-option
                  *ngFor="let creator of filteredCreators"
                  (click)="viewCreatorDetails(creator._id)"
                >
                  {{ creator.name }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>
          </div>

          <!-- Logout Button -->
          <div>
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
export class SearchBarComponent implements OnInit {
  isAsyncCall = false;
  creatorId: any;
  name: string = '';
  creators: any[] = [];
  searchControl = new FormControl('');
  filteredCreators: any[] = [];

  constructor(
    private authensService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.creatorId = params.get('userId') || '';
      // console.log(this.creatorId, 'userid');
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm: any) => this.searchCreators(searchTerm))
      )
      .subscribe();
  }

  page = 1;
  pageSize = 10;

  searchCreators(searchTerm: string) {
    if (searchTerm && searchTerm.trim() !== '') {
      this.isAsyncCall = true;
      const page = 1; // Set the desired page number
      const pageSize = 10; // Set the desired page size
      return this.authensService
        .searchCreatorInfo(searchTerm, page, pageSize)
        .pipe(
          switchMap((res: any) => {
            this.isAsyncCall = false;
            this.creators = res.result;
            this.filteredCreators = this.creators.slice(0, 5); // Limit results to 5 items
            return this.filteredCreators;
          })
        );
    } else {
      this.creators = [];
      this.filteredCreators = [];
      return [];
    }
  }

  viewCreatorDetails(creatorId: string) {
    this.router.navigate(['/user-home-page', creatorId]);
  }

  logout() {
    this.authensService.logout();
  }
}
