import { Component, OnInit, ElementRef, OnChanges, DoCheck } from '@angular/core';
import { Location } from '@angular/common';
import { YoutubePlayerService } from './../shared/services/youtube-player.service';
import { AnimationQueryMetadata } from '@angular/animations';
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/interval';

let _window: any = window;

export interface Speed {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  //styles: [('../../../../src/styles.scss')]
})


export class HomeComponent implements OnInit { //,DoCheck  {
  selected = 'option2';
  public player;
  public playingEvent = 'pause';
  status: boolean = false;
  selectedIndex: number = 0;
  endTime: any;
  startTime: any;
  timeInterval: any;
  bitStart: any = '0:00';
  bitEnd: any = '0:00';
  timeMessage = '0'
  timeoutInterval: number = 100;
  videoId: string = 'Zt8LyEvTC5s';
  videoTitle: string = 'test title';

  times = [
    { index: 0, selected: true, s: '0:03', e: '0:05' },
    { index: 1, selected: false, s: '0:10', e: '0:13' },
    { index: 2, selected: false, s: '0:60', e: '1:02' },
    { index: 3, selected: false, s: '0:00', e: '0:00' },
    { index: 4, selected: false, s: '0:00', e: '0:00' },
    { index: 5, selected: false, s: '0:00', e: '0:00' },
    { index: 6, selected: false, s: '0:00', e: '0:00' },
    { index: 7, selected: false, s: '0:00', e: '0:00' },
  ];

  speeds: Speed[] = [
    {value: '0.25', viewValue: '0.25'},
    {value: '0.5', viewValue: '0.5'},
    {value: '1.0', viewValue: '1.0'},
    {value: '1.5', viewValue: '1.5'},
    {value: '2.0', viewValue: '2.0'}
  ];

  selectedValue: string;

  constructor(
      //private youtubePlayer: YoutubePlayerService
      private elementRef:ElementRef,
      private location: Location
    ) { 

      this.location.subscribe((value: PopStateEvent) => {

        console.log(value);
        // if (value.url) {
        //   this.selectedIndex = (+value.url.substr(1) - 1) || 0;
        // }
      });

    }

  //  https://stackblitz.com/edit/youtube-player-m1evcf?file=src/main.ts

  // ngDoCheck() {
  //   console.log('Running change detection ', this.videoId);
  //   //this.player.seekTo('0:00');
  //   //this.SetVideoId(true);
  // }

  ngOnInit() {
    console.log('home works!');
    (window as any).onYouTubeIframeAPIReady = function () { this.onYouTubePlayerAPIReady() }.bind(this)
  }

  // https://developers.google.com/youtube/iframe_api_reference
  onYouTubePlayerAPIReady() {
      console.log('onYouTubePlayerAPIReady');
      this.player = new _window.YT.Player('player', {
          height: '200',
          width: '300',
          videoId: this.videoId,
          playerVars: { 'autoplay': 0, 'controls': 1,'autohide':1,'wmode':'opaque' },
          events: {
            'onStateChange': this.onPlayerStateChange.bind(this)
        }
      });
  }

  onPlayerStateChange(e) {

    this.timeMessage = '1';

    if (e.data == 2) {
        // player stopped (1 is stopped) 
        clearInterval(this.timeInterval);    
    }
    else if(e.data == 1){
      // player started
      this.SetVideoId(false);
    }
  }

  SetVideoId(startPlayer) {

    clearInterval(this.timeInterval);
    this.startTime = this.convertTime(this.bitStart);
    this.endTime = this.convertTime(this.bitEnd);

    this.timeInterval = setInterval(function () {

      var message = this.GetTime();
      this.timeMessage = message+'';
      (<HTMLInputElement>document.getElementById('testSpan')).innerHTML = message+'';

    }.bind(this), this.timeoutInterval);

    if(startPlayer){
      this.player.cueVideoById(this.videoId);
      this.player.seekTo(this.startTime);
      this.player.playVideo();
    }  
  }

  ngAfterContentInit() {
    var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/iframe_api"; // target/origin errors will be thrown if ssl and non ssl are used between the youtube api url and the host url runnning this application
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  save()
  {
    this.SaveState();
    this.selectBit(null, -1);
  }

  selectBit(event, time) {

    if(time.index != -1){
      this.times[this.selectedIndex].selected = false;
      this.selectedIndex = time.index;  
      this.times[time.index].selected = true;
    }
    
    //var inputStartValue = time.s; // (<HTMLInputElement>document.getElementById('s' + this.selectedIndex)).value;
    //var inputEndValue = time.e; //(<HTMLInputElement>document.getElementById('e' + this.selectedIndex)).value;

    this.bitStart = this.convertTime(time.s);
    this.bitEnd = this.convertTime(time.e);
    this.player.seekTo(this.bitStart);
    this.player.playVideo();
    this.SetVideoId(true);
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

  locationHashChanged() {

      console.log('locationHashChanged');

      if (window.location.hash.substr(1).length > 0) {

        console.log(window.location.hash);

          // LoadState();

          // if (currentBits != null) {
          //     //console.log(currentBits);
          //     bitStart = $(currentBits[0]).val();
          //     bitEnd = $(currentBits[1]).val();
          // }
          // else {
          //     bitStart = $("#s0").val();
          //     bitEnd = $("#e0").val();
          // }

          // //TODO: start video...

          // SetVideoId();
      }
  }

  SaveState() {

    //TODO: save previous state in history https://developer.mozilla.org/en-US/docs/Web/API/History_API

    document.title = "BitPractice-" + this.videoTitle;

    var BitPracticeModel = {};
    var title = this.videoTitle; // $("#title").val();
    var vid = this.videoId; // $("#videoid").val();

    // $("#bitTimes :input").each(function (index) {
    //     var key = $(this).attr('id');
    //     if (key != undefined) {
    //         if ($(this).val() != "0:00") {
    //             BitPracticeModel[key] = $(this).val();
    //         }
    //     }        
    // });

    BitPracticeModel['v'] = vid;
    BitPracticeModel['t'] = title;

    BitPracticeModel['s0'] = '0:03';
    BitPracticeModel['e0'] = '0:05.4';

    var json = JSON.stringify(BitPracticeModel); // $.param(BitPracticeModel);
    json = json.replace(/%3A/g, ':');
    json = json.replace(/"/g, '');
    json = json.replace(/{/g, '');
    json = json.replace(/}/g, '');

    setTimeout(function (e) {
        window.location.hash = e;
    }, 1, json);

    //var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?v=' + vid + '&t=' + title;
    //window.history.pushState({ path: newurl }, '', newurl);
  }

  getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  youtube_parser(url) {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      var match = url.match(regExp);

      if (match && match[7].length == 11) {
          //$("#e0").val("0:05"); //set default end time so something will play
          setTimeout(function() {
              this.SaveState();
          }, 1000);

          return match[7];
      }
      else {
          return url;
      }
  }

  parseParams(str) {
    return str.split('&').reduce(function (params, param) {
        var paramSplit = param.split('=').map(function (value) {
            return decodeURIComponent(value.replace('+', ' '));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
    }, {});
}


}
