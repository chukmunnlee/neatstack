import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { KboardService } from './kboard.service'
import { KboardComponent } from './components/kboard.component';
import { MainKboardComponent } from './components/main-kboard.component';
import { CreateComponent } from './components/create.component';
import { UpdateComponent } from './components/update.component';
import { HoldToDeleteDirective } from './directives/hold-to-delete.directive';
import { EditRouteGuard } from './kboard-route-guard'

const ROUTES: Routes = [
	{ path: '', component: MainKboardComponent },
	{ path: 'create', component: CreateComponent, canDeactivate: [ EditRouteGuard ] },
	{ path: 'update/:bId', component: UpdateComponent, canDeactivate: [ EditRouteGuard ] }
]

@NgModule({
	declarations: [ KboardComponent, MainKboardComponent, CreateComponent, UpdateComponent, HoldToDeleteDirective ],
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,
		RouterModule.forChild(ROUTES)
	],
	providers: [ KboardService, EditRouteGuard ],
	exports: [ RouterModule ]
})
export class KboardModule { }
