import { Component } from '@angular/core';

declare var navigator: any;
declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	get share(): boolean {
		return (!!navigator.share)
	}

	shareIt() {
		if (!this.share)
			return

		navigator.share({
			title: 'NEAT App Kboard',
			text: 'Trello clone developed with the NEAT stack.\nCheck it out',
			url: window.location.href
		})
	}
}
