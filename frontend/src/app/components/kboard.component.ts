import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, 
	Validators, AbstractControl, ValidationErrors } from '@angular/forms'
import { animate, transition, trigger, state, style } from '@angular/animations';

const nonWithSpace = (ctrl: AbstractControl) => {
	if (ctrl.value.trim().length > 0)
		return (null)
	return { nonWithSpace: true } as ValidationErrors
}

/*
const square = state('square', 
	style({
		border: '2px solid blue',
		background: 'lightblue',
		'border-radius': '0px'
	})
)
const circle = state('circle', 
	style({
		border: '2px solid red',
		background: 'pink',
		'border-radius': '100px'
	})
)
*/

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
		/*
		trigger('circle2square', [
			circle, square,
			transition('circle => square', [ animate('300ms') ]),
			transition('square => circle', [ animate('300ms') ]),
		])
		*/
	]
})
export class KboardComponent implements OnInit {

	boardGroup: FormGroup
	cardsArray: FormArray
	shape = 'square'

	constructor(private fb: FormBuilder) { }

	toggleShape() {
		this.shape = 'square' == this.shape? 'circle': 'square'
	}
	
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
		const board = this.boardGroup.value;
		console.log('board = ', board)
		this.initializeForm()
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
					[ Validators.required, Validators.minLength(3), nonWithSpace ]),
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
				description: this.fb.control('', [ Validators.required, nonWithSpace ]),
				priority: this.fb.control('0')
			})
		)
	}
}
