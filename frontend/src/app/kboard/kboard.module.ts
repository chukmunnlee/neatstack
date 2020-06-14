import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { KboardComponent } from './components/kboard.component';
import { MainKboardComponent } from './components/main-kboard.component';

const ROUTES: Routes = [
	{ path: '', component: MainKboardComponent }
]

@NgModule({
	declarations: [ KboardComponent, MainKboardComponent ],
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,
		RouterModule.forChild(ROUTES)
	],
	exports: [ RouterModule ]
})
export class KboardModule { }
