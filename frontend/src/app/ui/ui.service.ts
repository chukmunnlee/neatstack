import { Injectable } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

import { ConfirmationComponent } from '../ui/components/confirmation.component'

@Injectable()
export class UiService {
	constructor(private modalSvc: NgbModal) { }

	confirm(message: string): Promise<boolean> {

		const dialog = this.modalSvc.open(ConfirmationComponent)
		dialog.componentInstance.message = message

		return (
			dialog.result
				.then(() => true)
				.catch(() => false)
		)
	}
}
