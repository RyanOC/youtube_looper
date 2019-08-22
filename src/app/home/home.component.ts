import { Component, OnInit, ElementRef } from '@angular/core';
import { YoutubePlayerService } from './../shared/services/youtube-player.service';
import { AnimationQueryMetadata } from '@angular/animations';
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/interval';

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
  endTime: any;
  startTime: any;
  timeInterval: any;
  bitStart: any = '0:00';
  bitEnd: any = '0:00';
  timeMessage = ''
  timeoutInterval: number = 1000;

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
          playerVars: { 'autoplay': 0, 'controls': 1,'autohide':1,'wmode':'opaque' },
          events: {
            'onStateChange': this.onPlayerStateChange.bind(this)
        }
      });
  }





  onPlayerStateChange(e) {

    clearInterval(this.timeInterval);

    if (e.data == 2) {
        // player stopped (1 is stopped)     
    }
    else if(e.data == 1){
      // player started
      clearInterval(this.timeInterval);

      this.timeInterval = setInterval(function () {
        var message = this.GetTime();
        this.timeMessage = message;
        console.log(this.timeMessage);
      }.bind(this), this.timeoutInterval);
    }
  }

  SetVideoId() {

    clearInterval(this.timeInterval);

    //vid = $("#videoid").val();
    this.startTime = this.convertTime(this.bitStart);
    this.endTime = this.convertTime(this.bitEnd);

    this.timeInterval = setInterval(function () {
      var message = this.GetTime();
      this.timeMessage = message;
      console.log(this.timeMessage);
    }.bind(this), this.timeoutInterval);

    //this.player.cueVideoById(vid);
    this.player.seekTo(this.startTime);
    this.player.playVideo();
  }




  ngAfterContentInit() {
    var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/iframe_api"; // target/origin errors will be thrown if ssl and non ssl are used between the youtube api url and the host url runnning this application
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  selectBit(event, index) {
    this.selectedIndex = index;
    var inputStartValue = (<HTMLInputElement>document.getElementById('s' + this.selectedIndex)).value;
    var inputEndValue = (<HTMLInputElement>document.getElementById('e' + this.selectedIndex)).value;

    this.bitStart = inputStartValue;
    this.bitEnd = inputEndValue;
    this.player.seekTo(this.convertTime(inputStartValue));
    this.player.playVideo();
    this.SetVideoId();
  }

  playPause(event: string): void {
    this.player.playVideo();
  }

  GetTime() {
      let currentTime = this.player.getCurrentTime();

      if (currentTime >= this.endTime) {
          this.player.seekTo(this.startTime);
      }

      var current = this.player.getCurrentTime();
 
      try {
          current = current.toFixed(2);
      }
      catch (ex) {
          console.log(ex);
      }

      var minutes = Math.floor(current / 60);
      var seconds = current % 60;
      //seconds = parseFloat(seconds).toFixed(2);

      return minutes + ":" + seconds;
  }

  convertTime(input) {
    var parts = input.split(':'),
        minutes = +parts[0],
        seconds = +parts[1];
    return (minutes * 60 + seconds);
  }
}
