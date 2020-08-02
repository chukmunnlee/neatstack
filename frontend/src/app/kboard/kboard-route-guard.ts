import { Injectable } from '@angular/core'
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router'
import {Observable} from 'rxjs'

import { UiService } from '../ui/ui.service'

export interface EditRouteGuardPredicate {
	evaluate(): boolean
	confirmMessage(): string
}

@Injectable()
export class EditRouteGuard implements CanDeactivate<EditRouteGuardPredicate> {

	constructor(private uiSvc: UiService) { }

	canDeactivate(comp: EditRouteGuardPredicate, currRoute: ActivatedRouteSnapshot
			, currState: RouterStateSnapshot)
		: boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {

		console.info('canDeactivate: ', comp)

		if (!comp.evaluate())
			return (this.uiSvc.confirm(comp.confirmMessage()))

		return (true)
	}
}
