import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-async-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div
      class="flex"
      style="align-items: center; justify-content:center; flex-direction:column; padding:20px;"
    >
      <h2 [style.color]="textColor">{{ text ?? 'Fetching Data ....' }}</h2>
      <mat-spinner></mat-spinner>
    </div>
  `,
  styles: [],
})
export class AsyncSpinnerComponent {
  @Input() textColor = '';
  @Input() text: string | undefined;
}
