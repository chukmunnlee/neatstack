import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { KboardService } from './kboard.service'
import { KboardComponent } from './components/kboard.component';
import { MainKboardComponent } from './components/main-kboard.component';
import { CreateComponent } from './components/create.component';

const ROUTES: Routes = [
	{ path: '', component: MainKboardComponent },
	{ path: 'create', component: CreateComponent }
]

@NgModule({
	declarations: [ KboardComponent, MainKboardComponent, CreateComponent ],
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,
		RouterModule.forChild(ROUTES)
	],
	providers: [ KboardService ],
	exports: [ RouterModule ]
})
export class KboardModule { }
