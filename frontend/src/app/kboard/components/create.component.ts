import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from'@angular/router'

import {Kboard} from '../../../../../common/models';
import {KboardComponent} from './kboard.component';
import {BaseComponent} from './base.component';
import { KboardService } from '../kboard.service'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent extends BaseComponent implements OnInit {

	@ViewChild('kboard')
	kboardCtrl: KboardComponent

	constructor(router: Router, activatedRoute: ActivatedRoute
				, private kboardSvc: KboardService) { 
		super(router, activatedRoute)
	}
	
	ngOnInit(): void { }

	process(board: Partial<Kboard>) {
		console.info('CreateComponent: board = ', board)
		this.kboardSvc.addBoard(board)
			.then(boardId => console.info('new boardId: ', boardId))
			.catch(error => console.error('ERROR addBoard: ', error))
			.finally(() => {
				this.kboardCtrl.initializeForm()
				this.back()
			})
	}
}
