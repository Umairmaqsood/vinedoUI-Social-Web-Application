import { Component } from '@angular/core';
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
    <div>
      <h3>Basic Video Player</h3>
      <vg-player>
        <vg-overlay-play></vg-overlay-play>
        <vg-buffering></vg-buffering>
        <vg-scrub-bar>
          <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
          <vg-scrub-bar-buffering-time></vg-scrub-bar-buffering-time>
        </vg-scrub-bar>
        <vg-controls style="color: aliceblue;">
          <vg-play-pause></vg-play-pause>
          <vg-playback-button></vg-playback-button>
          <vg-time-display
            vgProperty="current"
            vgFormat="mm:ss"
          ></vg-time-display>
          <vg-scrub-bar style="pointer-events: none;"></vg-scrub-bar>
          <vg-time-display vgProperty="left" vgFormat="mm:ss"></vg-time-display>
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
      :host {
        display: block;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
      }

      h3 {
        font-size: 1.5rem;
        color: #333;
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
      }

      vg-controls button {
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
    `,
  ],
})
export class VideoPlayerComponent {}
