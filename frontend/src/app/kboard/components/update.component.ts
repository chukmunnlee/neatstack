import { Component, OnInit, ViewChild } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {BaseComponent} from './base.component';
import {KboardService} from '../kboard.service';
import {Kboard} from '../../../../../common/models';
import {EditRouteGuardPredicate} from '../kboard-route-guard';
import {KboardComponent} from './kboard.component';

import { mergeBoard } from '../../../../../common/utils';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent extends BaseComponent 
		implements OnInit, EditRouteGuardPredicate {

	@ViewChild('kboard')
	kboardCtrl: KboardComponent

	boardId: string;
	board: Kboard

	enableBtn = false;
	btnStyle = 'none'

	constructor(router: Router, activatedRoute: ActivatedRoute
				, private kboardSvc: KboardService) { 
	   super(router, activatedRoute)

		this.boardId = this.getRouteParam('bId')
	}
	
	ngOnInit(): void {
		this.kboardSvc.findBoardById(this.boardId)
			.then(result => {
				this.board = result
				console.info('board = ', this.board)
			})
			.catch(error => console.info('ERROR findBoardById: ', error))
	}

	formStatus(s: boolean) {
		this.enableBtn = s
	}

	evaluate() {
		// if form is dirty -> dont want to leave
		return (!this.kboardCtrl.boardGroup.dirty)
	}

	confirmMessage() {
		return ('You have unsaved data.\nDo you wish to leave?')
	}

	progress(p: number) {
		console.info('progress: ', p)
		if (p <= 0)
			this.btnStyle = 'none'
		else
			this.btnStyle = `linear-gradient(to left, rgb(220,220,220,0.4) ${100 - p}%, rgb(0,0,0,0) 0%)`
	}

	delete() {
		this.kboardSvc.deleteBoard(this.board)
			.catch(err => console.error('ERROR deleteBoard: ', err))
			.finally(() => this.navigateTo('../..'))
	}

	update(p: Partial<Kboard>) {
		const board = mergeBoard(p, this.board)
		this.kboardSvc.updateBoard(board)
			.then(result => {
				console.info(`Number of records updated: ${result}`)
				this.kboardCtrl.initializeForm()
			})
			.catch(error => console.error('ERROR updateBoard: ', error))
			.finally(() => this.navigateTo('../../'))
	}
}
