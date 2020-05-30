import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, 
	Validators, AbstractControl, ValidationErrors } from '@angular/forms'

const nonWithSpace = (ctrl: AbstractControl) => {
	if (ctrl.value.trim().length > 0)
		return (null)
	return { nonWithSpace: true } as ValidationErrors
}

@Component({
  selector: 'app-kboard',
  templateUrl: './kboard.component.html',
  styleUrls: ['./kboard.component.css']
})
export class KboardComponent implements OnInit {

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
