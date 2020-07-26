import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from'@angular/router'

import {Kboard} from '../../../../../common/models';
import {KboardComponent} from './kboard.component';
import {BaseComponent} from './base.component';
import { KboardService } from '../kboard.service'
import {EditRouteGuardPredicate} from '../kboard-route-guard';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent extends BaseComponent 
		implements OnInit, EditRouteGuardPredicate {

	@ViewChild('kboard')
	kboardCtrl: KboardComponent

	constructor(router: Router, activatedRoute: ActivatedRoute
				, private kboardSvc: KboardService) { 
		super(router, activatedRoute)
	}
	
	ngOnInit(): void { }

	evaluate() {
		// if form is dirty -> dont want to leave
		return (!this.kboardCtrl.boardGroup.dirty)
	}

	confirmMessage() {
		return ('You have unsaved data.\nDo you wish to leave?')
	}

	process(board: Partial<Kboard>) {
		console.info('CreateComponent: board = ', board)
		this.kboardSvc.addBoard(board)
			.then(boardId => {
				console.info('new boardId: ', boardId)
				this.kboardCtrl.initializeForm()
			})
			.catch(error => console.error('ERROR addBoard: ', error))
			.finally(() => this.back())
	}
}
