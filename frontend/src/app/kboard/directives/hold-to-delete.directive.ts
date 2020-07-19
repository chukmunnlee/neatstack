import { Directive, HostListener, Input, Output } from '@angular/core';
import {interval, Subject, Observable} from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators'

const INTERVAL = 100

@Directive({
  selector: '[holdToDelete]'
})
export class HoldToDeleteDirective {

	@Input()
	h2dDuration = 1000

	@Output()
	h2dProgress = new Subject<number>()

	@Output()
	h2dExpired = new Subject<void>()

	private btnState = new Subject<boolean>()
	private mouseUp$: Observable<boolean>;

	constructor() { 
		this.mouseUp$ = this.btnState
			.pipe(filter(v => v))
	}

	@HostListener('mousedown')
	mousedown() {
		console.info('mouse down')
		interval(INTERVAL)
			.pipe(
				map(v => ((v * INTERVAL) / this.h2dDuration) * 100),
				takeUntil(this.mouseUp$)
			)
			.subscribe(
				v => {
					this.h2dProgress.next(v)
					if (v >= 100) {
						this.btnState.next(true)
						this.h2dExpired.next()
					}
				},
				null,
				() => this.h2dProgress.next(0)
			)
	}

	@HostListener('mouseup')
	mouseup() {
		console.info('mouse up')
		this.btnState.next(true)
	}

}
