import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'projects/material/src/public-api';

@Component({
  selector: 'app-async-spinner-button',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <button
      mat-raised-button
      [ngClass]="classes"
      [disabled]="isAsyncCall || disabled"
      [type]="type"
      [style.color]="isAsyncCall ? 'black' : 'white'"
      [style.background-color]="isAsyncCall ? 'whitesmoke' : '#2aaa8a'"
    >
      <ng-content *ngIf="!isAsyncCall"></ng-content>
      <mat-spinner *ngIf="isAsyncCall" [diameter]="20"></mat-spinner>
    </button>
  `,
  styles: [
    `
      button {
        height: 36px;
        width: 100%;
      }
      :host {
        pointer-events: none;
      }
      button span {
        pointer-events: none;
      }
      button {
        pointer-events: auto;
      }
    `,
  ],
})
export class AsyncSpinnerButtonComponent {
  @Input() isAsyncCall!: boolean;
  @Input() classes!: string;
  @Input() disabled!: boolean;
  @Input() type!: string;
}
