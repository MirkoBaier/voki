import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainingsGamePage } from './trainings-game';

@NgModule({
  declarations: [
    TrainingsGamePage,
  ],
  imports: [
    IonicPageModule.forChild(TrainingsGamePage),
  ],
})
export class TrainingsGamePageModule {}
