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

	update(p: Partial<Kboard>) {
		const board = mergeBoard(p, this.board)
		this.kboardSvc.updateBoard(board)
			.then(result => console.info(`Number of records updated: ${result}`))
			.catch(error => console.error('ERROR updateBoard: ', error))
			.finally(() => this.navigateTo('../../'))
	}
}
