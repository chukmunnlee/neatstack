import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {BaseComponent} from './base.component';
import {KboardService} from '../kboard.service';
import {Kboard} from '../../../../../common/models';
import { mergeBoard } from '../../../../../common/utils';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent extends BaseComponent implements OnInit {

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
			.then(result => console.info(`Number of records updated: ${result}`))
			.catch(error => console.error('ERROR updateBoard: ', error))
			.finally(() => this.navigateTo('../../'))
	}
}
