import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const ROUTES: Routes = [
	{ path: '', component: MainComponent },
	{ path: 'kboard', 
			loadChildren: () => import('./kboard/kboard.module').then(m => m.KboardModule)
	}
]

@NgModule({
  declarations: [
    AppComponent, MainComponent,
  ],
  imports: [
		BrowserModule, BrowserAnimationsModule,
		RouterModule.forRoot(ROUTES),
		NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
