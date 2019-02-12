import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflineGamePage } from './offline-game';

@NgModule({
  declarations: [
    OfflineGamePage,
  ],
  imports: [
    IonicPageModule.forChild(OfflineGamePage),
  ],
})
export class OfflineGamePageModule {}
