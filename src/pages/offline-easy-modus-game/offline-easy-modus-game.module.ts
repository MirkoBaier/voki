import { NgModule,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflineEasyModusGamePage } from './offline-easy-modus-game';
import { DragulaService, DragulaModule } from 'ng2-dragula';

@NgModule({
  declarations: [
    OfflineEasyModusGamePage
  ],
  imports: [
    DragulaModule,
    IonicPageModule.forChild(OfflineEasyModusGamePage),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class OfflineEasyModusGamePageModule {}
