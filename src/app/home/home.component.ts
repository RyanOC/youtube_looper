import { Component, OnInit, ElementRef } from '@angular/core';
import { YoutubePlayerService } from './../shared/services/youtube-player.service';

let _window: any = window;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  //styles: [('../../../../src/styles.scss')]
})

export class HomeComponent implements OnInit {

  public player;
  public playingEvent = 'pause';
  status: boolean = false;
  selectedIndex: number = 0;

  constructor(
      //private youtubePlayer: YoutubePlayerService
      private elementRef:ElementRef
    ) { }

  //  https://stackblitz.com/edit/youtube-player-m1evcf?file=src/main.ts

  ngOnInit() {
    console.log('home works!');
    (window as any).onYouTubeIframeAPIReady = function () { this.onYouTubePlayerAPIReady() }.bind(this)
  }

  onYouTubePlayerAPIReady() {
    console.log('onYouTubePlayerAPIReady');
    this.player = new _window.YT.Player('player', {
        height: '200',
        width: '300',
        videoId: 'Zt8LyEvTC5s',
        playerVars: { 'autoplay': 0, 'controls': 1,'autohide':1,'wmode':'opaque' }
    });
}

  ngAfterContentInit() {

    // let doc = window.document;
    // let playerApi = doc.createElement('script');
    // playerApi.type = 'text/javascript';
    // playerApi.src = 'https://www.youtube.com/iframe_api';
    // doc.body.appendChild(playerApi);

    var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/iframe_api"; // target/origin errors will be thrown if ssl and non ssl are used between the youtube api url and the host url runnning this application
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


  }

  onClick(event, index) {
    console.log(event.srcElement.id);
    this.selectedIndex = index;
  }

  playPause(event: string): void {

    //this.player.playVideo();
    this.player.playVideo('Zt8LyEvTC5s', 'The Eliminators - Moment of Truth');
  }
}
