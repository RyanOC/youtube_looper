import { Component, OnInit, ElementRef, OnChanges, DoCheck } from '@angular/core';
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
  startTime: number = 0;
  endTime: number = 0;
  
  timeInterval: any;
  timeMessage = '0'
  timeoutInterval: number = 10;

  loop = {
    videoId: '',
    videoTitle: 'test title',
    times: [
      { i: 0, sl: true, s: '0:03', e: '0:05' },
      { i: 1, sl: false, s: '0:10', e: '0:13' },
      { i: 2, sl: false, s: '0:60', e: '1:02' },
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

  selectedValue: string;

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
    (window as any).onYouTubeIframeAPIReady = function () { this.onYouTubePlayerAPIReady() }.bind(this)
  }

  // https://developers.google.com/youtube/iframe_api_reference
  onYouTubePlayerAPIReady() {
      this.player = new _window.YT.Player('player', {
          height: '140',
          width: '240',
          videoId: this.loop.videoId,
          playerVars: { 'autoplay': 0, 'controls': 1,'autohide':1,'wmode':'opaque' },
          events: {
            'onStateChange': this.onPlayerStateChange.bind(this)
        }
      });
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

  SaveState() {

    // https://howchoo.com/g/nwywodhkndm/how-to-turn-an-object-into-query-string-parameters-in-javascript
    // https://stackoverflow.com/questions/6566456/how-to-serialize-an-object-into-a-list-of-url-query-parameters

    document.title = "YouTube Looper -" + this.loop.videoTitle;

    var loopClone = JSON.parse(JSON.stringify(this.loop));

    // delete loopClone.times[0].sl;
    // delete loopClone.times[1].sl;
    // delete loopClone.times[2].sl;
    // delete loopClone.times[3].sl;
    // delete loopClone.times[4].sl;
    // delete loopClone.times[5].sl;
    // delete loopClone.times[6].sl;
    // delete loopClone.times[7].sl;

    // if(loopClone.times[0].s == '0:00') delete loopClone.times[0];
    // if(loopClone.times[1].s == '0:00') delete loopClone.times[1];
    // if(loopClone.times[2].s == '0:00') delete loopClone.times[2];
    // if(loopClone.times[3].s == '0:00') delete loopClone.times[3];
    // if(loopClone.times[4].s == '0:00') delete loopClone.times[4];
    // if(loopClone.times[5].s == '0:00') delete loopClone.times[5];
    // if(loopClone.times[6].s == '0:00') delete loopClone.times[6];
    // if(loopClone.times[7].s == '0:00') delete loopClone.times[7];

    let json: string = JSON.stringify(loopClone); // $.param(BitPracticeModel);
    // json = json.replace(/%3A/g, ':');
    // json = json.replace(/"/g, '');
    // json = json.replace(/{/g, '');
    // json = json.replace(/}/g, '');
    // json = json.replace(/videoId/g, 'vid');
    // json = json.replace(/videoTitle/g, 'vt');
    // json = json.replace(/times/g, 't');
    // json = json.replace(/,null/g, '');

    setTimeout(function (e) {
        window.location.hash = e;
    }, 10, json);

    //var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?v=' + vid + '&t=' + title;
    //window.history.pushState({ path: newurl }, '', newurl);
  }

  loadState() {

    document.title = "YouTube Looper - " + this.loop.videoTitle;
    var hash = window.location.hash.substr(1);

    if(hash != ''){
      var loopState = decodeURI(hash);
      this.loop = JSON.parse(loopState);
      document.title = "YouTube Looper - " + this.loop.videoTitle;
    }
    else{
      // set default loop up...
      this.loop.videoId = 'CcGoYPR9FBk';
      this.loop.videoTitle = 'Getting Started';
      this.loop.times = [
        { i: 0, sl: true, s: '0:00', e: '0:02' },
        { i: 1, sl: false, s: '0:00', e: '0:00' },
        { i: 2, sl: false, s: '0:60', e: '0:00' },
        { i: 3, sl: false, s: '0:00', e: '0:00' },
        { i: 4, sl: false, s: '0:00', e: '0:00' },
        { i: 5, sl: false, s: '0:00', e: '0:00' },
        { i: 6, sl: false, s: '0:00', e: '0:00' },
        { i: 7, sl: false, s: '0:00', e: '0:00' }
      ];
    }
  
    //get t & v from querystring...
    //$("#title").val(getParameterByName('t'));
    //$("#videoid").val(getParameterByName('v'));

    // for (var property in BitPracticeModel) {
    //     if (BitPracticeModel.hasOwnProperty(property)) {
    //         if (property != undefined) {
    //             $("#" + property).val(BitPracticeModel[property]);
    //         }      
    //     }
    // }

    //document.title = "BitPractice-" + $("#title").val();
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

  clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


}