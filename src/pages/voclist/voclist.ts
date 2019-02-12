import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {VocubalarService} from "../../services/vocubalar";
import {OfflineVoc} from "../../models/offlineVoc";

/**
 * Generated class for the VoclistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-voclist',
  templateUrl: 'voclist.html',
})
export class VoclistPage {
  offlineArrayListe = [];


  constructor(public navCtrl: NavController, private  vocService: VocubalarService) {
  }

  ionViewWillEnter() {
    this.vocService.getOfflineDataListOne(this.vocService.actualListName).then(res => this.offlineArrayListe = res);
  }

  async removeItemFromList(voc: OfflineVoc){
    await this.vocService.removeItemFrom(voc.time, voc.listName);
    await this.vocService.getOfflineDataListOne(voc.listName).then(res => this.offlineArrayListe = res);
  }

}
