import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'

@Component({
  selector: 'app-main-kboard',
  templateUrl: './main-kboard.component.html',
  styleUrls: ['./main-kboard.component.css']
})
export class MainKboardComponent implements OnInit {

	constructor(private router: Router) { }
	
	ngOnInit(): void { }

	back() {
		this.router.navigate([ '/' ])
	}

}
