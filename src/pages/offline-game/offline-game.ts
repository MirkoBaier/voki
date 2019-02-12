import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, TextInput} from 'ionic-angular';
import {OfflineService} from "../../services/offlineservice";
import {VocubalarService} from "../../services/vocubalar";
import {NgForm} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";


@IonicPage()
@Component({
  selector: 'page-offline-game',
  templateUrl: 'offline-game.html',
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
export class OfflineGamePage {
  @ViewChild('input') myInput: TextInput;

  iscorr: boolean = false;
  actVoc = [];
  voc: string = "";
  trans: string = "";
  userTrans: string = "";
  counter = 0;
  visibleState = 'invisible';
  actualModus: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private offlineService: OfflineService, private vocService: VocubalarService, private alertController: AlertController) {
   this.actualModus = this.vocService.actualModus;
  }

  ionViewWillEnter() {
    this.actVoc = this.offlineService.actualVoc;
    console.log(this.actVoc);
    for (let i = this.offlineService.actualVoc.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.offlineService.actualVoc[i], this.offlineService.actualVoc[j]] = [this.offlineService.actualVoc[j], this.offlineService.actualVoc[i]];
    }
    if(this.vocService.actualModus=='1') {
      this.voc = this.offlineService.actualVoc[0].voc;
      this.trans = this.offlineService.actualVoc[0].trans;
    }else if(this.vocService.actualModus=='2'){
      this.trans = this.offlineService.actualVoc[0].voc;
      this.voc = this.offlineService.actualVoc[0].trans;
    }
  }


  ionViewDidLoad(){
    setTimeout(() => {
      this.myInput.setFocus();
    },500);
  }

  checkCorrect(form: NgForm){
    let TIME_IN_MS = 500;

    if(this.userTrans == this.trans || this.userTrans+"" == this.trans){
      this.visibleState = (this.visibleState == 'invisible') ? 'visible' : 'invisible';
      setTimeout( () => {
        this.visibleState = 'invisible'
      }, TIME_IN_MS);
      setTimeout(() => {
        this.myInput.setFocus();
      },400);
    }else{
      const alert = this.alertController.create({
        title: 'Falsche Übersetzung',
        subTitle: 'Deine Überstzung: ' + this.userTrans + '<br\>Richtig wäre: ' + this.trans + ' --> ' + this.voc,
        buttons: [
          {
            text: 'Verstanden',
            handler: () => {
              setTimeout(() => {
                this.myInput.setFocus();
              },400);
            }
          }
        ],
        cssClass: `alert-head`,
      });
      alert.present();
    }

    this.counter++;
    if(this.actVoc[this.counter]==undefined) {
      this.navCtrl.pop();
    }
    if(this.counter==10){
      this.navCtrl.pop();
    }
    if(this.actVoc[this.counter]!=undefined) {
      if(this.vocService.actualModus=='1') {
        this.voc = this.actVoc[this.counter].voc;
        this.trans = this.actVoc[this.counter].trans;
      }else if(this.vocService.actualModus=='2'){
        this.trans = this.actVoc[this.counter].voc;
        this.voc = this.actVoc[this.counter].trans;
      }
    }
    form.reset();

  }

}
