import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router'

import {BaseComponent} from './base.component';

@Component({
  selector: 'app-main-kboard',
  templateUrl: './main-kboard.component.html',
  styleUrls: ['./main-kboard.component.css']
})
export class MainKboardComponent extends BaseComponent implements OnInit {

	constructor(router: Router, activateRoute: ActivatedRoute) { 
		super(router, activateRoute)
	}
	
	ngOnInit(): void { }

}
