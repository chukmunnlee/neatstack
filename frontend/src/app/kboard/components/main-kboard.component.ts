import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router'

import {BaseComponent} from './base.component';
import { KboardSummary} from 'common/models';
import {PERSISTENCE_SERVICE} from '../kboard.module';
import {KboardDatabase} from 'common/persistence';
import {IdentityService} from 'src/app/identity.service';

@Component({
  selector: 'app-main-kboard',
  templateUrl: './main-kboard.component.html',
  styleUrls: ['./main-kboard.component.css']
})
export class MainKboardComponent extends BaseComponent implements OnInit {

	boards: KboardSummary[] = []

	constructor(router: Router, activateRoute: ActivatedRoute
				, @Inject(PERSISTENCE_SERVICE) private kboardSvc: KboardDatabase
				, private idSvc: IdentityService) { 
		super(router, activateRoute)
	}
	
	ngOnInit(): void { 
		this.kboardSvc.getKboards(this.idSvc.getUserId())
			.then(boards => this.boards = boards)
			.catch(error => console.error('ERROR getBoards: ', error))
	}

}
