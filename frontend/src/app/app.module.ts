import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { KboardComponent } from './components/kboard.component';

@NgModule({
  declarations: [
    AppComponent,
    KboardComponent
  ],
  imports: [
		BrowserModule,
		FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
