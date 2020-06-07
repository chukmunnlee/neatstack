import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
		BrowserModule, BrowserAnimationsModule,
		FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
