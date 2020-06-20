import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from'@angular/router'

import {Kboard} from '../../../../../common/models';
import {KboardComponent} from './kboard.component';
import {BaseComponent} from './base.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent extends BaseComponent implements OnInit {

	@ViewChild('kboard')
	kboardCtrl: KboardComponent

	constructor(router: Router, activatedRoute: ActivatedRoute) { 
		super(router, activatedRoute)
	}
	
	ngOnInit(): void { }

	process(board: Partial<Kboard>) {
		console.info('CreateComponent: board = ', board)
		console.info('CreateComponent: @ViewChild = ', this.kboardCtrl.value)
		this.kboardCtrl.initializeForm()
		this.back()
	}
}
