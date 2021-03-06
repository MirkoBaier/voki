import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {OfflineService} from "../../services/offlineservice";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {VocubalarService} from "../../services/vocubalar";

/**
 * Generated class for the OfflineTrainingsGamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offline-trainings-game',
  templateUrl: 'offline-trainings-game.html',
  animations: [
    trigger('myvisibility' ,[
      state('visible', style ({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('invisible => visible', animate('0.5s'))
    ])
  ]
})
export class OfflineTrainingsGamePage {
  yoloItem: string[] = [];
  translate: string = "";
  counter: number = 0;
  points: number = 0;
  visibleState = 'invisible';
  voc: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private offlineService: OfflineService, private alertController: AlertController, private vocService: VocubalarService) {
  }

  ionViewWillEnter() {
    for (let i = this.offlineService.actualVoc.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.offlineService.actualVoc[i], this.offlineService.actualVoc[j]] = [this.offlineService.actualVoc[j], this.offlineService.actualVoc[i]];
    }

    this.setRandomVocForSpecificModus();
    this.mixVocabulary();
  }

  onLoadNext(userChoice){
    if(userChoice===this.voc){
      this.points++;
      this.visibleState = (this.visibleState == 'invisible') ? 'visible' : 'invisible';
      setTimeout( () => {
        this.visibleState = 'invisible'
      }, 500);
    }else{
      this.showRightAnswerAlert(userChoice);
    }
    if (this.counter >= 10 || this.counter >= this.offlineService.actualVoc.length-1) {
      this.navCtrl.setRoot('OfflinePage');
    }

    this.counter++;

      for (let i = this.offlineService.actualVoc.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [this.offlineService.actualVoc[i], this.offlineService.actualVoc[j]] = [this.offlineService.actualVoc[j], this.offlineService.actualVoc[i]];
      }
      this.setRandomVocForSpecificModus();

      this.mixVocabulary();

  }

  mixVocabulary(){
    for(let i = 0; i<= this.yoloItem.length-1; i++){
      const j = Math.floor(Math.random() * (i + 1));
      [this.yoloItem[i], this.yoloItem[j]] = [this.yoloItem[j], this.yoloItem[i]];
    }
  }

  showRightAnswerAlert(userChoice){
    const alert = this.alertController.create({
      title: 'Falsche Übersetzung',
      subTitle: 'Deine Überstzung: ' + userChoice + '<br\>Richtig wäre: ' + this.translate + ' --> ' + this.voc,
      buttons: [
        {
          text: 'Verstanden',
          handler: () => {

          }
        }
      ],
      cssClass: `alert-head`,
    });
    alert.present();
  }

  setRandomVocForSpecificModus(){
    if(this.vocService.actualModus=='3') {
      this.voc = this.offlineService.actualVoc[0].trans;
      this.translate = this.offlineService.actualVoc[0].voc;
      this.yoloItem[0] = this.offlineService.actualVoc[0].trans;
      this.yoloItem[1] = this.offlineService.actualVoc[1].trans;
      this.yoloItem[2] = this.offlineService.actualVoc[2].trans;
      this.yoloItem[3] = this.offlineService.actualVoc[3].trans;
    }else if(this.vocService.actualModus=='4'){
      this.voc = this.offlineService.actualVoc[0].voc;
      this.translate = this.offlineService.actualVoc[0].trans;
      this.yoloItem[0] = this.offlineService.actualVoc[0].voc;
      this.yoloItem[2] = this.offlineService.actualVoc[2].voc;
      this.yoloItem[1] = this.offlineService.actualVoc[1].voc;
      this.yoloItem[3] = this.offlineService.actualVoc[3].voc;
    }
  }

}
