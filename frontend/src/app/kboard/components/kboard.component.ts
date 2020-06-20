import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, 
	Validators, AbstractControl, ValidationErrors } from '@angular/forms'
import { animate, transition, trigger, state, style } from '@angular/animations';
import {Subject} from 'rxjs';

import { Kboard } from '../../../../../common/models'

const nonWhiteSpace = (ctrl: AbstractControl) => {
	if (ctrl.value.trim().length > 0)
		return (null)
	return { nonWhiteSpace: true } as ValidationErrors
}

const voidStyle = style({ opacity: 0, transform: 'translateY(-100%)' })

@Component({
	selector: 'app-kboard',
	templateUrl: './kboard.component.html',
	styleUrls: ['./kboard.component.css'],
	animations: [
		trigger('fadeInOut', [
			transition('void => *', [ voidStyle, animate('300ms') ]),
			transition('* => void', [ animate('300ms'), voidStyle ])
		])
	],
	exportAs: 'kboardCtrl'
})
export class KboardComponent implements OnInit {

	@Output()
	onSubmit = new Subject<Partial<Kboard>>()

	get value(): Partial<Kboard> {
		return (this.boardGroup.value)
	}

	boardGroup: FormGroup
	cardsArray: FormArray

	constructor(private fb: FormBuilder) { }
	
	// lifecycle method
	// https://angular.io/guide/lifecycle-hooks
	ngOnInit(): void {
		this.initializeForm()
	}

	addCard() {
		this.cardsArray.push(this.createCard())
	}
	removeCard(idx: number) {
		this.cardsArray.removeAt(idx)
	}
	processForm() {
		this.onSubmit.next(this.value)
	}

	isControlValid(ctrlName: string, idx = -1): boolean {
		let ctrl: FormControl
		if (idx == -1) 
			ctrl = this.boardGroup.get(ctrlName) as FormControl
		else {
			const grp = this.cardsArray.controls[idx]
			ctrl = grp.get(ctrlName) as FormControl
		}
		return (ctrl.pristine || ctrl.valid)
	}

	initializeForm() {
		this.boardGroup = this.createBoard()
		this.cardsArray = this.boardGroup.get('cards') as FormArray
	}

	// helper methods
	private createBoard(): FormGroup {
		return (
			this.fb.group({
				title: this.fb.control('', 
					[ Validators.required, Validators.minLength(3), nonWhiteSpace ]),
				createdBy: this.fb.control('', [ Validators.required, Validators.email ]),
				comments: this.fb.control(''),
				cards: this.createCards()
			})
		)
	}
	private createCards(): FormArray {
		return (
			this.fb.array([])
		)
	}
	private createCard(): FormGroup {
		return (
			this.fb.group({
				description: this.fb.control('', [ Validators.required, nonWhiteSpace ]),
				priority: this.fb.control('0')
			})
		)
	}
}
