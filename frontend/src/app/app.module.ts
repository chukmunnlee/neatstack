import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';

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
		RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
