import { Component, OnInit, ElementRef, OnChanges, DoCheck, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
//import { YoutubePlayerService } from './../shared/services/youtube-player.service';
//import { AnimationQueryMetadata } from '@angular/animations';
//import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/interval';

let _window: any = window;

export interface Speed {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
  //styles: [('../../../../src/styles.scss')]
})

export class PlayerComponent implements OnInit, OnDestroy {
//,DoCheck  {
  selected = 'option2';
  public player;
  public playingEvent = 'pause';

  status: boolean = false;
  selectedIndex: number = 0;
  startTime: number = 0;
  endTime: number = 0;
  
  timeInterval: any;
  timeMessage = '0'
  timeoutInterval: number = 10;

  loop = {
    videoId: 'WCYBpNw_0hg',
    videoTitle: 'Attack Of Robot Atomico',
    times: [
      { i: 0, sl: true, s: '0:46', e: '0:49' },
      { i: 1, sl: false, s: '0:58', e: '0:66' },
      { i: 2, sl: false, s: '0:00', e: '0:00' },
      { i: 3, sl: false, s: '0:00', e: '0:00' },
      { i: 4, sl: false, s: '0:00', e: '0:00' },
      { i: 5, sl: false, s: '0:00', e: '0:00' },
      { i: 6, sl: false, s: '0:00', e: '0:00' },
      { i: 7, sl: false, s: '0:00', e: '0:00' },
    ]
  };

  speeds: Speed[] = [
    {value: '0.25', viewValue: '0.25'},
    {value: '0.5', viewValue: '0.5'},
    {value: '1.0', viewValue: '1.0'},
    {value: '1.5', viewValue: '1.5'},
    {value: '2.0', viewValue: '2.0'}
  ];

  selectedSpeedValue: string = '1.0';

  constructor(
      //private youtubePlayer: YoutubePlayerService
      private elementRef:ElementRef,
      private location: Location
    ) { 

      this.location.subscribe((value: PopStateEvent) => {
        //console.log(value);
      });
    }

  //  https://stackblitz.com/edit/youtube-player-m1evcf?file=src/main.ts
  // ngDoCheck() {
  //   console.log('Running change detection ', this.videoId);
  // }

  ngOnInit() {

    this.loadState();

    var youTubeApi = (window as any).onYouTubeIframeAPIReady;

    if(youTubeApi != undefined){
      this.onYouTubePlayerAPIReady();
    }
    else{
      (window as any).onYouTubeIframeAPIReady = function () { this.onYouTubePlayerAPIReady() }.bind(this);
    }
  }

  ngOnDestroy(): void {
    // unsubscribe to window object
    // remove player div contents.
    clearInterval(this.timeInterval); 
    //(window as any).onYouTubeIframeAPIReady = null;
    console.log('ngOnDestroy');
  }

  // https://developers.google.com/youtube/iframe_api_reference
  onYouTubePlayerAPIReady() {
      this.player = new _window.YT.Player('player', {
          height: '140',
          width: '240',
          videoId: this.loop.videoId,
          playerVars: { 'autoplay': 0, 'controls': 0, 'autohide':1, 'wmode':'opaque' },
          events: {
            'onReady': this.onPlayerReady.bind(this),
            'onStateChange': this.onPlayerStateChange.bind(this)
        }
      });
  }

  onPlayerReady(e) {
    this.loop.times[0].sl = true;
    this.SetVideoId(true);
  }

  onPlayerStateChange(e) {

    this.timeMessage = '0';

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
    this.startTime = this.convertTime(this.loop.times[this.selectedIndex].s);
    this.endTime = this.convertTime(this.loop.times[this.selectedIndex].e);
    this.timeInterval = setInterval(function () {
      var message = this.GetTime();
      this.timeMessage = message+'';
      (<HTMLInputElement>document.getElementById('currentTime')).innerHTML = message+'';
    }.bind(this), this.timeoutInterval);

    if(startPlayer){    
      this.player.loadVideoById(this.loop.videoId, this.startTime);
      this.player.playVideo(); 
    }  
  }

  ngAfterContentInit() {

    let url = "https://www.youtube.com/iframe_api";
    var scripts = document.getElementsByTagName('script');

    for (var i = scripts.length; i--;) {
      console.log(scripts[i].src);
      if (scripts[i].src == url) {
        return;
      }
    }

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api"; // target/origin errors will be thrown if ssl and non ssl are used between the youtube api url and the host url runnning this application
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  save()
  {
    this.SaveState();
    this.selectBit(null, null);
  }

  selectBit(event, time) {
    if(time && time.i != -1){
      this.loop.times[this.selectedIndex].sl = false;
      this.selectedIndex = time.i;  
      this.loop.times[time.i].sl = true;
    }
    else if(!time){
      return;
    }
    this.SetVideoId(true);
  }

  playPause(event: string): void {
    this.player.playVideo();
  }

  GetTime() {
      let currentTime = this.player.getCurrentTime();

      if(!currentTime) currentTime = 0;

      if (currentTime >= this.endTime) {
          this.player.seekTo(this.startTime);
      }

      //var current = this.player.getCurrentTime();

      try {
        currentTime = (currentTime == undefined ? 0 : currentTime.toFixed(2));
      }
      catch (ex) {
          console.log(ex);
      }

      var minutes = Math.floor(currentTime / 60);
      var seconds = currentTime % 60;
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
      //console.log('locationHashChanged');
      if (window.location.hash.substr(1).length > 0) {
        //console.log(window.location.hash);
      }
  }

  onSpeedSelection(){
    this.player.setPlaybackRate(parseFloat(this.selectedSpeedValue));
  }

  SaveState() {

    document.title = "YouTube Looper -" + this.loop.videoTitle;

    var loopClone = JSON.parse(JSON.stringify(this.loop));

    delete loopClone.times[0].sl;
    delete loopClone.times[1].sl;
    delete loopClone.times[2].sl;
    delete loopClone.times[3].sl;
    delete loopClone.times[4].sl;
    delete loopClone.times[5].sl;
    delete loopClone.times[6].sl;
    delete loopClone.times[7].sl;

    var urlStateString = (this.serializeLoop(this.loop) + '&&' + this.serializeTimes(this.loop.times));

    urlStateString = urlStateString.replace(/,/g, '&&');
    urlStateString = urlStateString.replace(/&sl=true/g, '');
    urlStateString = urlStateString.replace(/&sl=false/g, '');

    setTimeout(function (e) {
        window.location.hash = e;
    }, 10, urlStateString);
  }

  loadState() {

    document.title = "YouTube Looper - " + this.loop.videoTitle;
    var hash = window.location.hash.substr(1);

    if(hash != ''){

      var res = hash.split('&&');
      var loopDetails = this.parseParams(res[0]);

      // todo: reconstruct entire loop object...
      this.loop.videoId = loopDetails.v;
      this.loop.videoTitle = loopDetails.t;

      document.title = "YouTube Looper - " + this.loop.videoTitle;

      res.forEach(function(item){
        var time = this.parseParams(item);

        if(time.i != undefined){
          this.loop.times[time.i].sl = false;
          this.loop.times[time.i].s = time.s;
          this.loop.times[time.i].e = time.e;
        }
        
      }.bind(this));

      this.loop.times[0].sl = true;
    }
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

  clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
  }

  serializeLoop(loop){
    var loopString = 'v=' + loop.videoId + '&' + 't=' + loop.videoTitle;
    return loopString;
  }

  serializeTimes(times){
    var timesString = '';
    times.forEach(function(element) {
      if(element.e != '0:00'){
        var queryString = Object.keys(element).map(key => key + '=' + element[key]).join('&');
        timesString += queryString + ',';
      }
    });
  
    timesString = timesString.replace(/(^,)|(,$)/g, ""); 
    return timesString;
  }

}