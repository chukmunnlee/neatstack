import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router'

import {BaseComponent} from './base.component';
import {KboardService} from '../kboard.service';
import {Kboard} from '../../../../../common/models';

@Component({
  selector: 'app-main-kboard',
  templateUrl: './main-kboard.component.html',
  styleUrls: ['./main-kboard.component.css']
})
export class MainKboardComponent extends BaseComponent implements OnInit {

	boards: Kboard[] = []

	constructor(router: Router, activateRoute: ActivatedRoute
				, private kboardSvc: KboardService) { 
		super(router, activateRoute)
	}
	
	ngOnInit(): void { 
		this.kboardSvc.getBoards()
			.then(boards => this.boards = boards)
			.catch(error => console.error('ERROR getBoards: ', error))
	}

}
