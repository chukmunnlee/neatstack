import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import player from 'lottie-web'
import { LottieModule } from 'ngx-lottie'

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const ROUTES: Routes = [
	{ path: '', component: MainComponent },
	{ path: 'kboard', 
			loadChildren: () => import('./kboard/kboard.module').then(m => m.KboardModule)
	},
	{ path: '**', pathMatch: 'full', redirectTo: '/' }
]

@NgModule({
  declarations: [
    AppComponent, MainComponent,
  ],
  imports: [
		BrowserModule, BrowserAnimationsModule,
		RouterModule.forRoot(ROUTES),
		LottieModule.forRoot({ player: () => player }),
		NgbModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
