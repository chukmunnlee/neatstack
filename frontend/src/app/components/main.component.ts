import { Component, OnInit } from '@angular/core';

import { AnimationOptions } from 'ngx-lottie'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

	options: AnimationOptions = {
		path: 'assets/click.json'
	}

  constructor() { }

  ngOnInit(): void {
  }

}
