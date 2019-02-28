import {Component, ViewChild} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, TextInput} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {NetworkService} from "../../services/networkservice";
import {VocubalarService} from "../../services/vocubalar";
import {OfflineVoc} from "../../models/offlineVoc";
import {OfflineService} from "../../services/offlineservice";


@IonicPage({
  name: 'OfflinePage',
  priority: 'high'
})
@Component({
  selector: 'page-offline',
  templateUrl: 'offline.html',
})
export class OfflinePage {
  @ViewChild('nav') nav: NavController;
  @ViewChild('input') myInput: TextInput;

  inputvoc: string;
  inputtrans: string;
  listName: string;
  private voclist: boolean = true;
  offlineArrayTemp = [];
  offlineArrayList = [];
  private minimizing: boolean = true;

  constructor(public navCtrl: NavController,
              private authService: AuthService,
              private netService: NetworkService,
              private vocService: VocubalarService,
              private offlineService: OfflineService,
              public actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController) {

  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.myInput.setFocus();
    },400);
    //alle Vokabeln
    this.vocService.getOfflineData().then(res => {
        if (res != null) {
          this.offlineArrayTemp = res;
        }
      }
    );
    //nicht alle Vokabeln
    this.vocService.getOfflineDataList().then(res => {
      if(res!=null){
        this.offlineArrayList = res;
      }
    })
  }

  openList(listName: string){
    this.vocService.actualListName = listName;
    this.navCtrl.push('VoclistPage');
  }

  async removeListe(list: string, time: string){
    await this.vocService.removeList(list, time).then(() => this.vocService.getOfflineDataList().then(res => {
      this.offlineArrayList = res;
    }));

    await this.vocService.getOfflineDataList().then(res => {
      this.offlineArrayList = res;
    })
  }

  minimize(is: boolean){
    this.minimizing = is;
  }

  ionViewDidLoad() {
    this.authService.splashing();
    this.authService.OfflineMenu = true;
  }

  goReg() {
    if (this.netService.isOnline == true) {
      if (this.authService.loggedIn == false) {
        this.navCtrl.setRoot('RegistrationPage');
      } else {
        this.navCtrl.setRoot('HomePage')
      }
    } else {

    }
  }

  vocliste(voc: boolean) {
    this.voclist = voc;
  }

  //Vokabel hinzufügen
  async test() {
    let OfflineArray = [];
    let Offline = new OfflineVoc(this.inputvoc, this.inputtrans, this.listName, 0, 0, 0, new Date().toString());
    OfflineArray.push(Offline);
    await this.vocService.setOfflineVoc(OfflineArray).then(() => {
      this.vocService.getOfflineDataList().then(res => this.offlineArrayList = res);
      this.inputtrans = "";
      this.inputvoc = "";
      setTimeout(() => {
        this.myInput.setFocus();
      },400);
    });

  }

  async startVoc(voc: OfflineVoc){
    await this.vocService.getOfflineDataListOne(voc.listName).then(res => this.offlineService.actualVoc = res );
    this.presentActionSheet();
    /*this.navCtrl.push("OfflineGamePage")*/
  }

  remove() {
    this.vocService.removeOffline();
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Modus auswählen',
      buttons: [
        {
          text: 'Vokabelliste Online lernen',
          role: 'destructive',
          handler: () => {
            this.vocService.actualModus = '0';
            this.navCtrl.push("OnevsonePage")
          }
        },
        {
          text: 'Vokabel zu Übersetzung',
          role: 'destructive',
          handler: () => {
            this.vocService.actualModus = '1';
            this.navCtrl.push("OfflineGamePage")
          }
        }, {
          text: 'Übersetzung zu Vokabel',
          handler: () => {
            this.vocService.actualModus = '2';
            this.navCtrl.push("OfflineGamePage")
          }
        },
        {
          text: 'Training: Vokabel zu Übersetzung',
          handler: () => {
            this.vocService.actualModus = '3';
            if(this.offlineService.actualVoc.length >= 4) {
              this.navCtrl.push("OfflineTrainingsGamePage")
            }else{
              this.showAlert();
            }
          }},
        {
          text: 'Training: Übersetzung zu Vokabel',
          handler: () => {
            this.vocService.actualModus = '4';
            if(this.offlineService.actualVoc.length >=4) {
              this.navCtrl.push("OfflineTrainingsGamePage")
            }else{
              this.showAlert();
            }
          }
        },{
          text: 'Zurück',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Fehler!',
      subTitle: 'Du benötigst mindestens vier Vokabeln für den Trainingsmodus',
      buttons: ['OK']
    });
    alert.present();
  }
}
