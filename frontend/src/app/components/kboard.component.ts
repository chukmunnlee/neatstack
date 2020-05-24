import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'

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

	initializeForm() {
		this.boardGroup = this.createBoard()
		this.cardsArray = this.boardGroup.get('cards') as FormArray
	}

	// helper methods
	private createBoard(): FormGroup {
		return (
			this.fb.group({
				title: this.fb.control(''),
				createdBy: this.fb.control(''),
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
				description: this.fb.control(''),
				priority: this.fb.control('')
			})
		)
	}
}
