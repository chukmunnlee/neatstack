import { Router, ActivatedRoute } from '@angular/router'

export class BaseComponent {

	constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

	getRouteParam(name: string): string {
		return (this.activatedRoute.snapshot.params[name])
	}

	home() {
		this.navigateTo('/')
	}

	back() {
		this.navigateTo('..')
	}

	navigateTo(...path: string[]) {
		this.router.navigate(path, { relativeTo: this.activatedRoute })
	}

}
