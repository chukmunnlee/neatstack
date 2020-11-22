import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from'@angular/router'

import {Kboard} from 'common/models';
import {KboardComponent} from './kboard.component';
import {BaseComponent} from './base.component';
import {EditRouteGuardPredicate} from '../kboard-route-guard';
import {PERSISTENCE_SERVICE} from '../kboard.module';
import {KboardDatabase} from 'common/persistence';
import {priorityToNumber} from 'common/utils';

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
				, @Inject(PERSISTENCE_SERVICE) private kboardSvc: KboardDatabase) { 
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
		board.cards = board.cards.map(priorityToNumber)
		this.kboardSvc.insertKboard(board)
			.then(boardId => {
				console.info('new boardId: ', boardId)
				this.kboardCtrl.initializeForm()
			})
			.catch(error => console.error('ERROR addBoard: ', error))
			.finally(() => this.back())
	}
}
