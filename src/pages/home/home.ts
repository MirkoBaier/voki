import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavController, ToastController} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {NameService} from "../../services/name";
import {OneVoneService} from "../../services/oneVone";
import {Game} from "../../models/game";
import {Observable, Subject} from "rxjs";
import {IonicPage} from 'ionic-angular';
import {tap} from "rxjs/operators";
import {FcmProvider} from "../../services/fcm";
import {TrainingsGame} from "../../models/trainingsGame";
import {TrainingsService} from "../../services/training";
import {VocubalarService} from "../../services/vocubalar";
import {NativePageTransitions, NativeTransitionOptions} from "@ionic-native/native-page-transitions";



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
//ionic cordova build android --build --release --aot  --minifyjs --minifycss -- -- --versionCode=0.0.7
export class HomePage {
  @ViewChild('nav') nav: NavController;
  userName: any;
  uid: string;
  openTrainingsGames: Observable<TrainingsGame[]>;
  openTrainingsGamesNotTurn: Observable<TrainingsGame[]>;
  openGames: Observable<Game[]>;
  openGamesNotTurn: Observable<Game[]>;



  finishedTrainingsGames: Observable<TrainingsGame[]>;
  finishedGames: Observable<Game[]>;
  private ngUnsubscribe: Subject<void> = new Subject();


  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private nameService: NameService,
              private alertCtrl: AlertController,
              private oneVoneService: OneVoneService,
              private fcm: FcmProvider,
              private toastCtrl: ToastController,
              private trainingsService: TrainingsService,
              private vocubalarService: VocubalarService,
              private loadingCtrl: LoadingController,
              private nativePageTransitions: NativePageTransitions
  ) {


  }

  async ngOnInit(): Promise<any> {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    if (this.userName == undefined) {
      await this.nameService.getUsername().then(name => {
        this.userName = name;
      });
    }

    this.oneVoneService.getNewGames().valueChanges().takeUntil(this.ngUnsubscribe).subscribe(res => {
      if (this.authService.getActiveUser() != null) {
        if (res.length > 0) {
          if (res.length != 0) {
            this.showAlert(res[0]);
          }
        }
      }
    });
    this.trainingsService.getNewGames().valueChanges().takeUntil(this.ngUnsubscribe).subscribe(res => {
      if (this.authService.getActiveUser() != null) {
        if (res.length > 0) {
          if (res.length != 0) {
            this.showAlertTraining(res[0]);
          }
        }
      }
    });
    this.openTrainingsGamesNotTurn = this.trainingsService.getStartedGamesListNotTurn().valueChanges().takeUntil(this.ngUnsubscribe);
    this.openGamesNotTurn = this.oneVoneService.getStartedGamesListNotTurn().valueChanges().takeUntil(this.ngUnsubscribe);
    this.finishedTrainingsGames = this.trainingsService.getFinishedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
    this.openTrainingsGames = this.trainingsService.getStartedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
    this.finishedGames = this.oneVoneService.getFinishedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
    this.openGames = this.oneVoneService.getStartedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
    loader.dismiss();
  }


  async ionViewWillEnter() {
    this.authService.OfflineMenu=false;
    await this.oneVoneService.showGameStats().then(res => {
      if (res.length != 0) {
        for (let i = (res.length - 1); i >= 0; i--) {
          this.showResult(res[i]);
        }
      }
    });
    await this.trainingsService.showGameStats().then(res => {
      if (res.length != 0) {
        for (let i = (res.length - 1); i >= 0; i--) {
          this.showResult(res[i]);
        }
      }
    });

  }

  checkAndSetSlideStorage() {
    if (this.vocubalarService.get('showSlide') == undefined) {
      this.vocubalarService.set('showSlide', false);
      //show slide logic should run
    } else {
      // this block is running that means your localStorageService has already been set to false i.e it is not the first time your app is running.
        console.log("kein Slide");
    }
  }

  ionViewDidLoad() {
    this.authService.OfflineMenu = false;
    this.fcm.getToken();

    this.fcm.listenToNotifications().pipe(tap(msg => {
        const toast = this.toastCtrl.create({
          message: msg.body,
          duration: 3000
        });
        toast.present();
      })
    )
      .subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showAlert(res: any) {
    let nothingPressed: boolean = true;
    //Ruft neue Spiele auf
    if (res.started == false) {
      const confirm = this.alertCtrl.create({
        title: 'Spielanfrage',
        message: 'Nimmst du das Spiel gegen ' + res.enemy + ' an ?',
        buttons: [
          {
            text: 'Ablehnen',
            handler: () => {
              nothingPressed = false;
              this.oneVoneService.deleteMatch(res.enemy, res.matchId);
            }
          },
          {
            text: 'Annehmen',
            handler: () => {
              nothingPressed = false;
              this.oneVoneService.updateGame(res.enemy);
            }
          }
        ]
      });
      confirm.present();
      confirm.onDidDismiss(() => {
        if(nothingPressed == true){
          this.oneVoneService.deleteMatch(res.enemy, res.matchId);
        }
      })
    }
  }

  showAlertTraining(res: any) {
    let nothingPressed: boolean = true;
    //Ruft neue Spiele auf
    if (res.started == false) {
      const confirm = this.alertCtrl.create({
        title: 'Spielanfrage',
        message: 'Nimmst du das TrainingsSpiel gegen ' + res.enemy + ' an ?',
        buttons: [
          {
            text: 'Ablehnen',
            handler: () => {
              nothingPressed = false;
              this.trainingsService.deleteMatch(res.enemy, res.matchId);
            }
          },
          {
            text: 'Annehmen',
            handler: () => {
              nothingPressed = false;
              this.trainingsService.updateGame(res.enemy);
            }
          }
        ]
      });
      confirm.present();
      confirm.onDidDismiss(() => {
        if(nothingPressed == true){
          this.trainingsService.deleteMatch(res.enemy, res.matchId);
        }
      })
    }
  }

  onLoadSettings() {
    this.navCtrl.push('SettingsPage');
  }

  onLoadLeague() {
    this.navCtrl.push('LeaguePage');
  }

  onLoadOnevsOne() {
    this.navCtrl.push('OnevsoneChoicePage');
  }

  loadOffline() {
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 600
    };

    this.nativePageTransitions.flip(options);
    this.navCtrl.setRoot('OfflinePage');
  }

  async onLoadOnevsOneGame(enemy: string) {
    console.log(enemy);
    this.oneVoneService.enemyNow = enemy;
    this.oneVoneService.trainingsModus = false;
    this.navCtrl.push('BeforeOnevsoneGamePage');
  }

  async onLoadTrainingsGame(enemy: string) {
    this.trainingsService.enemyNow = enemy;
    this.oneVoneService.trainingsModus = true;
    this.navCtrl.push('BeforeOnevsoneGamePage')
  }

  showResult(game: any) {
    let alert;
    if (game.pointsEnemy < game.pointsUser) {
      alert = this.alertCtrl.create({
        title: 'Gewonnen!',
        subTitle: 'Du hast gegen ' + game.enemy + ' mit ' + game.pointsUser + ":" + game.pointsEnemy + ' gewonnen!',
        buttons: ['OK']
      });
    } else if (game.pointsEnemy == game.pointsUser) {
      alert = this.alertCtrl.create({
        title: 'Unentschieden!',
        subTitle: 'Du hast gegen ' + game.enemy + ' mit ' + game.pointsUser + ":" + game.pointsEnemy + 'unentschieden gespielt!',
        buttons: ['OK']
      });
    } else {
      alert = this.alertCtrl.create({
        title: 'Verloren!',
        subTitle: 'Du hast gegen ' + game.enemy + ' mit ' + game.pointsUser + ":" + game.pointsEnemy + ' verloren!',
        buttons: ['OK']
      });
    }
    alert.present();
  }

}
