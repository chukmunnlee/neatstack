import { Router, ActivatedRoute } from '@angular/router'

export class BaseComponent {

	private prevUrl = '/'

	constructor(private router: Router, private activatedRoute: ActivatedRoute) { 
		this.prevUrl = this.router.getCurrentNavigation().initialUrl.toString()
		console.info('prevUrl = ', this.prevUrl)
	}

	getRouteParam(name: string): string {
		return (this.activatedRoute.snapshot.params[name])
	}

	home() {
		this.navigateTo('/')
	}

	back() {
		this.navigateTo(this.prevUrl)
	}

	navigateTo(...path: string[]) {
		this.router.navigate(path, { relativeTo: this.activatedRoute })
	}

}
