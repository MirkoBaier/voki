import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {OneVoneService} from "../../services/oneVone";
import {NameService} from "../../services/name";
import {TrainingsService} from "../../services/training";


@IonicPage()
@Component({
  selector: 'page-onevsone',
  templateUrl: 'onevsone.html',
})
export class OnevsonePage {
  users: any[];
  oldUsers: any[];
  constructor(private oneVoneService:  OneVoneService,
              private authService: AuthService,
              private navCtrl: NavController,
              private nameService: NameService,
              private trainingsService: TrainingsService,
              private loadingCtrl: LoadingController) {
  }

  async ngOnInit(){
    //Alle User werden angezeigt ausnahme er selber
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let username = await this.nameService.getUsername();
    await this.authService.getDocuments("userProfile").then(users=> {
      for(let i = users.length - 1; i >= 0; i--) {
        if(users[i].username === username) {
          users.splice(i, 1);
        }
      }
      this.users = users;
      this.oldUsers= users;
      loading.dismiss();
      })
  }



  initializeItems(){
    this.users = this.oldUsers;
  }


  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.users = this.users.filter((item) => {
        return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onLoadpage(user: any){
    if(this.oneVoneService.isToggled==false) {
      this.oneVoneService.addGame(user, false)
    }else{
      this.trainingsService.addGame(user);
    }
   this.navCtrl.setRoot('HomePage')
  }

  async randomEnemy(){
    if(this.oneVoneService.isToggled==false) {
      await this.oneVoneService.addRandomGame(this.oneVoneService.language)
    }else{
      await this.trainingsService.addRandomGame(this.oneVoneService.language);
    }
    this.navCtrl.setRoot('HomePage')
  }
}
