import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  //styles: [('../../../../src/styles.scss')]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('home works!');
  }
}
