import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflineTrainingsGamePage } from './offline-trainings-game';

@NgModule({
  declarations: [
    OfflineTrainingsGamePage,
  ],
  imports: [
    IonicPageModule.forChild(OfflineTrainingsGamePage),
  ],
})
export class OfflineTrainingsGamePageModule {}
