import { Component, OnInit, Output, Input, ElementRef, ContentChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, 
	Validators, AbstractControl, ValidationErrors } from '@angular/forms'
import { animate, transition, trigger, state, style } from '@angular/animations';
import {Subject, BehaviorSubject, Subscription} from 'rxjs';

import { Kboard, Kcard } from '../../../../../common/models'

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
export class KboardComponent implements OnInit, OnDestroy, AfterViewInit {

	@Output()
	onSubmit = new Subject<Partial<Kboard>>()

	@Output()
	onValid = new BehaviorSubject<boolean>(false)

	@Output()
	onCancel = new Subject<void>()

	@Input()
	get value(): Partial<Kboard> {
		return (this.boardGroup.value)
	}
	set value(v: Partial<Kboard>) {
		this.initializeForm(v)
	}

	@ContentChild('submit')
	submitBtn: ElementRef

	boardGroup: FormGroup
	cardsArray: FormArray

	private statusChangesSub: Subscription

	constructor(private fb: FormBuilder) { }
	
	// lifecycle method
	// https://angular.io/guide/lifecycle-hooks
	ngOnInit(): void {
		this.initializeForm()
	}

	ngOnDestroy() {
		this.statusChangesSub.unsubscribe()
	}

	ngAfterViewInit() {
		console.info('#submit = ', this.submitBtn)
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

	cancel() {
		this.onCancel.next()
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

	initializeForm(b: Partial<Kboard> = null) {
		if (null != this.statusChangesSub)
			this.statusChangesSub.unsubscribe()

		this.boardGroup = this.createBoard(b)
		this.cardsArray = this.boardGroup.get('cards') as FormArray

		this.statusChangesSub = this.boardGroup.statusChanges
				.subscribe(v => this.onValid.next('VALID' == v))
	}

	// helper methods
	private createBoard(b: Partial<Kboard> = null): FormGroup {
		return (
			this.fb.group({
				title: this.fb.control(b? b.title: ''
						, [ Validators.required, Validators.minLength(3), nonWhiteSpace ]),
				createdBy: this.fb.control(b? b.createdBy: ''
						, [ Validators.required, Validators.email ]),
				comments: this.fb.control(b? b.comments: ''),
				cards: this.createCards(b? b.cards: [])
			})
		)
	}
	private createCards(c: Kcard[] = []): FormArray {
		return (
			this.fb.array(c.map(v => this.createCard(v)))
		)
	}
	private createCard(c: Kcard = null): FormGroup {
		return (
			this.fb.group({
				description: this.fb.control(c? c.description: ''
						, [ Validators.required, nonWhiteSpace ]),
				priority: this.fb.control(c? c.priority.toString(): '0')
			})
		)
	}
}
