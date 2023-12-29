import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  template: `
    <div class="video-player-container">
      <h3>Vinedo Player</h3>
      <vg-player>
        <vg-overlay-play></vg-overlay-play>
        <vg-buffering></vg-buffering>

        <vg-scrub-bar>
          <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
          <vg-scrub-bar-buffering-time></vg-scrub-bar-buffering-time>
          <div
            class="custom-progress-bar"
            [style.width.%]="getProgressBarWidth()"
          >
            <div class="progress"></div>
          </div>
        </vg-scrub-bar>

        <vg-controls style="color: aliceblue;">
          <vg-play-pause></vg-play-pause>
          <vg-playback-button></vg-playback-button>
          <vg-time-display
            vgProperty="current"
            vgFormat="mm:ss"
          ></vg-time-display>
          <vg-scrub-bar style="flex: 1;"></vg-scrub-bar>
          <vg-time-display
            vgProperty="total"
            vgFormat="mm:ss"
          ></vg-time-display>
          <vg-track-selector></vg-track-selector>
          <vg-mute></vg-mute>
          <vg-volume></vg-volume>
          <vg-fullscreen></vg-fullscreen>
        </vg-controls>

        <video
          [vgMedia]="$any(media)"
          #media
          id="singleVideo"
          preload="auto"
          crossorigin
        >
          <source src="../../../assets/test.mp4" type="video/mp4" />
          <track
            kind="subtitles"
            label="English"
            src="http://static.videogular.com/assets/subs/pale-blue-dot.vtt"
            srclang="en"
            default
          />
        </video>
      </vg-player>
    </div>
  `,
  styles: [
    `
      .video-player-container {
        display: block;
        max-width: 800px;
        margin: 0 auto;
        border-radius: 10px;
        overflow: hidden;
      }

      h3 {
        font-size: 1.5rem;
        color: #575555;
      }

      vg-player {
        position: relative;
        max-width: 100%;
        margin-top: 20px;
      }

      video {
        width: 100%;
      }

      vg-controls {
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      vg-controls button {
        display: inline-block;
        background-color: transparent;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        margin: 0 5px;
        transition: opacity 0.3s;
      }

      vg-controls button:hover {
        opacity: 0.7;
      }

      vg-scrub-bar {
        width: 100%;
        margin-top: 10px;
      }

      .custom-progress-bar {
        position: absolute;
        height: 5px;
        background-color: #3498db;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .progress {
        height: 100%;
        background-color: #2c3e50;
      }
    `,
  ],
})
export class VideoPlayerComponent {
  @ViewChild('media') media: any;

  getProgressBarWidth(): number {
    const currentTime = this.media?.currentTime || 0;
    const totalDuration = this.media?.duration || 1;
    return (currentTime / totalDuration) * 100;
  }
}
