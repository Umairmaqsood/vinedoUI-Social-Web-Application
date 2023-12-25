import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'projects/material/src/public-api';
import { AsyncSpinnerComponent } from '../async-spinner/async-spinner.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    AsyncSpinnerComponent,
    SearchBarComponent,
  ],
  template: `
    <app-search-bar></app-search-bar>
    <div class="screenSize">
      <h2 style="text-align:center">Multimedia Dashboard</h2>

      <!-- news-feed.component.html -->
      <div class="feed-container">
        <div *ngFor="let post of posts" class="post">
          <div *ngIf="post.type === 'image'" class="image-post">
            <img [src]="post.url" alt="Post" />
          </div>
          <div *ngIf="post.type === 'video'" class="video-post">
            <video controls>
              <source [src]="post.url" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="post-actions">
            <button mat-icon-button (click)="likePost(post)">
              <mat-icon>thumb_up</mat-icon>
            </button>
            <p>{{ post.likes }}</p>
            <button mat-icon-button class="m-t-5" (click)="showComments(post)">
              <mat-icon>comment</mat-icon>
            </button>
            <button mat-icon-button class="m-t-5" (click)="sharePost(post)">
              <mat-icon>share</mat-icon>
            </button>

            <div *ngIf="post.showComments">
              <div *ngFor="let comment of post.comments" class="comment">
                <p>{{ comment.author }}: {{ comment.text }}</p>
              </div>
              <form (submit)="addComment(post, commentInput.value)">
                <mat-form-field appearance="outline" class="m-t-20">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    matInput
                    #commentInput
                  />
                </mat-form-field>
                <button mat-icon-button type="submit" style="margin-top:25px">
                  <mat-icon>send</mat-icon>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .feed-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center; /* Align items in the center horizontally */
      }

      .screenSize {
        padding: 40px 200px;
      }

      @media (max-width: 767px) {
        .screenSize {
          padding: 5px 10px 10px 40px;
        }
      }

      .post {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
      }

      .image-post img,
      .video-post video {
        width: 100%;
        height: auto;
        max-width: 100%; /* Ensure responsive images and videos */
        max-height: 400px; /* Set a maximum height for images and videos */
        object-fit: contain; /* Maintain aspect ratio and cover the container */
      }

      .post-actions {
        padding: 10px;
        display: flex;

        align-items: center;
      }
    `,
  ],
})
export class NewsFeedComponent {
  posts: any[] = [
    {
      type: 'image',
      url: 'assets/pictures/pic1.jpg',
      likes: 10,
      comments: [],
      showComments: false,
    },
    {
      type: 'video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: 15,
      comments: [],
      showComments: false,
    },
    {
      type: 'image',
      url: 'assets/pictures/pic2.jpg',
      likes: 10,
      comments: [],
      showComments: false,
    },
    {
      type: 'image',
      url: 'assets/pictures/pic4.png',
      likes: 10,
      comments: [],
      showComments: false,
    },
  ];

  // Fetch comments for a post from API (dummy endpoint used for demonstration)
  fetchComments(post: any) {
    // this.http
    //   .get<any[]>('https://jsonplaceholder.typicode.com/comments')
    //   .subscribe((response) => {
    //     post.comments = response.filter(
    //       (comment) => comment.postId === post.id
    //     );
    //   });
  }

  // Like/Dislike a post
  likePost(post: any) {
    post.likes++;
    // Call API to update likes (dummy API endpoint used for demonstration)
    // this.http
    //   .post('https://your-api.com/likePost', { postId: post.id })
    //   .subscribe(() => {
    //     // On success, handle any additional logic
    //   });
  }

  // Add a comment to a post
  addComment(post: any, commentText: string) {
    // Add the comment locally to show immediately
    const newComment = { author: 'User', text: commentText };
    post.comments.push(newComment);

    // Call API to add comment (dummy API endpoint used for demonstration)
    // this.http
    //   .post('https://your-api.com/addComment', {
    //     postId: post.id,
    //     comment: newComment,
    //   })
    //   .subscribe(() => {
    //     // On success, handle any additional logic
    //   });
  }

  // Share a post
  sharePost(post: any) {
    // Call API to share post (dummy API endpoint used for demonstration)
    // this.http
    //   .post('https://your-api.com/sharePost', { postId: post.id })
    //   .subscribe(() => {
    //     // On success, handle any additional logic
    //   });
  }

  // Toggle comments visibility
  showComments(post: any) {
    if (!post.comments.length) {
      this.fetchComments(post);
    }
    post.showComments = !post.showComments;
  }
}
