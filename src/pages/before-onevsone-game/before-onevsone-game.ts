import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import {OneVoneService} from "../../services/oneVone";
import {NameService} from "../../services/name";
import {TrainingsService} from "../../services/training";


@IonicPage()
@Component({
  selector: 'page-before-onevsone-game',
  templateUrl: 'before-onevsone-game.html',
})
export class BeforeOnevsoneGamePage {
  userName: string;
  enemyName: string;
  userPoints: number;
  enemyPoints: number;
  fieldCorrect: boolean[] = [];
  fieldNotPlayed: boolean[] = [];
  theUserturn: boolean = false;

  constructor(private navCtrl: NavController, private oneVoneService: OneVoneService, private nameService: NameService, private trainingsService: TrainingsService) {
    for(let i = 51; i>0 ; i--) {
      this.fieldNotPlayed.push(true);
      this.fieldCorrect.push(true);
    }
  }

  ionViewDidEnter(){
    if(this.oneVoneService.trainingsModus==false) {
      this.oneVoneService.getMatchIdByUsername(this.oneVoneService.enemyNow).then(res => {
        this.oneVoneService.getSomething(this.nameService.userId, res).then(ress => {
          this.theUserturn = ress[0].userTurn;
          // this.oneVoneService. = ress[0].vocName;
          //Für die richtige Seite
          if (ress[0].startedFrom == ress[0].user) {
            this.userName = ress[0].enemy;
            this.enemyName = ress[0].user;
            this.userPoints = ress[0].pointsEnemy;
            this.enemyPoints = ress[0].pointsUser;
          } else {
            this.enemyName = ress[0].enemy;
            this.userName = ress[0].user;
            this.userPoints = ress[0].pointsUser;
            this.enemyPoints = ress[0].pointsEnemy;
          }
          for (let i = 0; i < (ress[0].isCorrect.length); i++) {
            this.fieldNotPlayed[i] = false;
            this.fieldCorrect[i] = ress[0].isCorrect[i];
          }

        })
      });
    }else{
      this.trainingsService.getMatchIdByUsername(this.trainingsService.enemyNow).then(res => {
        this.trainingsService.getSomething(this.nameService.userId, res).then(ress => {
          console.log(ress[0].vocName);
          this.theUserturn = ress[0].userTurn;

          //Für die richtige Seite
          if (ress[0].startedFrom == ress[0].user) {
            this.userName = ress[0].enemy;
            this.enemyName = ress[0].user;
            this.userPoints = ress[0].pointsEnemy;
            this.enemyPoints = ress[0].pointsUser;
          } else {
            this.enemyName = ress[0].enemy;
            this.userName = ress[0].user;
            this.userPoints = ress[0].pointsUser;
            this.enemyPoints = ress[0].pointsEnemy;
          }
          for (let i = 0; i < (ress[0].isCorrect.length); i++) {
            this.fieldNotPlayed[i] = false;
            this.fieldCorrect[i] = ress[0].isCorrect[i];
          }

        })
      });
    }
  }


  async loadGame() {
    if (this.oneVoneService.trainingsModus == false) {
      await this.oneVoneService.updateGameFromOnePlaying(this.oneVoneService.enemyNow);
      this.navCtrl.setRoot('OnevsoneGamePage');
    }else{
      await this.trainingsService.updateGameFromOnePlaying(this.trainingsService.enemyNow);
      this.navCtrl.setRoot('TrainingsGamePage');
    }
  }

}
