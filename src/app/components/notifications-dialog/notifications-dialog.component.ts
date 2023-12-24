import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'projects/material/src/public-api';

@Component({
  selector: 'app-notifications-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <mat-card
      style="background-color: #2d3436 !important; color: white !important; width: 700px,
      height: 300px;"
    >
      <div style="padding: 20px;">
        <div style="display: flex; justify-content: flex-end;">
          <button mat-icon-button aria-label="close dialog" mat-dialog-close>
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <h2 style="text-align:center">Notifications</h2>
        <ng-container *ngFor="let notification of notificationItems">
          <div
            style="display: flex; justify-content: space-between; gap: 40px;"
          >
            <div style="width: calc(70% - 40px);">
              <label><b>User's Request</b></label>
              <p [ngStyle]="getTextStyle(notification.userRequest)">
                {{ notification.userRequest }}
              </p>
            </div>
            <div style="width: calc(25% - 80px); margin-top: 10px;">
              <label><b>Amount:</b></label>
              <h4 *ngIf="notification.amount">
                &euro;{{ notification.amount }}
              </h4>
            </div>

            <div
              style="display: flex; flex-direction: column; justify-content: space-evenly;"
            >
              <button
                mat-raised-button
                (click)="authorizeNotification()"
                style="background-color: #2aaa8a; margin-bottom: 2px;"
              >
                Authorize
              </button>
              <button
                (click)="revokeNotification()"
                mat-raised-button
                color="warn"
              >
                Revoke
              </button>
            </div>

            <div
              style="width: calc(15% - 40px); display: flex; align-items: center;"
            >
              <div
                style="font-size: 20px; border: 3px solid white; padding: 6px; border-radius: 20px;"
              >
                {{ notification.duration }}
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </mat-card>
  `,
  styles: [],
})
export class NotificationsDialogComponent {
  // @Input() notificationItems: any[] = [];

  getTextStyle(userRequest: string): {
    'font-size': string;
    'line-height': string;
    'margin-top': string;
  } {
    const textSize = userRequest && userRequest.length > 50 ? '14px' : '16px';
    return {
      'font-size': textSize,
      'line-height': '1.3',
      'margin-top': '5px',
    };
  }

  constructor() {}

  notificationItems: any[] = [
    {
      userRequest:
        'I would like to hear you sing Dance The Night by Dua Lipa. It is my favorite song and she is my favorite singer!',
      amount: '25.00',
      duration: '48h',
    },
    {
      userRequest: 'Please create a customized artwork with vibrant colors.',
      amount: '50.00',
      duration: '24h',
    },
    {
      userRequest: 'Please create a customized artwork with vibrant colors.',
      amount: '50.00',
      duration: '44h',
    },
  ];

  authorizeNotification() {
    console.log('authorize');
  }
  revokeNotification() {
    console.log('revoke');
  }
}
