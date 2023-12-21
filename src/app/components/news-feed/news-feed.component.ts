import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'projects/material/src/public-api';

@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: ` <p>news-feed works!</p> `,
  styles: [],
})
export class NewsFeedComponent {}
