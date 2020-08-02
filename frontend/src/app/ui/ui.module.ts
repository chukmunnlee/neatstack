import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from './components/confirmation.component'
import { UiService } from './ui.service'

@NgModule({
  declarations: [ConfirmationComponent],
  imports: [
    CommonModule, NgbModalModule
  ],
	exports: [ ConfirmationComponent ],
	providers: [ UiService ]
})
export class UiModule { }
