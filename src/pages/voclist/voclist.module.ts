import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoclistPage } from './voclist';

@NgModule({
  declarations: [
    VoclistPage,
  ],
  imports: [
    IonicPageModule.forChild(VoclistPage),
  ],
})
export class VoclistPageModule {}
