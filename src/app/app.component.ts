import {Component, ViewChild} from '@angular/core';
import {Events, LoadingController, MenuController, NavController, Platform} from 'ionic-angular';
// import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';


import {AuthService} from "../services/auth";
import {SettingsPage} from "../pages/settings/settings";
import {AngularFireAuth} from "@angular/fire/auth";
import {OneVoneService} from "../services/oneVone";
import {NameService} from "../services/name";
import {ConnectionStatusEnum, NetworkService} from "../services/networkservice";
import {Network} from '@ionic-native/network';
import {timer} from "rxjs/observable/timer";
import {StatusBar} from "@ionic-native/status-bar";


@Component({
  templateUrl: 'app.html'
})
export class VokabelQuiz {
  rootPage: any;
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;
  afAuth: AngularFireAuth;
  showSplash = true;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              afAuth: AngularFireAuth,
              private authService: AuthService,
              private menuCtrl: MenuController,
              private oneVoneService: OneVoneService,
              private nameService: NameService,
              public events: Events,
              public network: Network,
              public networkProvider: NetworkService,
              public loadingCtrl: LoadingController) {
    this.afAuth = afAuth;
    this.networkProvider.initializeNetworkEvents();

    this.events.subscribe('network:online', () => {
      if(this.isAuthenticated==true){
        this.rootPage = 'OfflinePage'
      }
    });


    afAuth.authState.subscribe(user => {
      if (user) {
        console.log('user');
        this.authService.loggedIn = true;
        this.isAuthenticated = true;
        this.nameService.getUsername().then(res => {
          this.rootPage = 'HomePage';
        }).catch(err => {
            console.log('Error' + err);
          console.log(this.authService.newReg);
            if(this.authService.newReg==true){
              this.rootPage = 'NamePage'
            }
            else if (this.networkProvider.previousStatus == ConnectionStatusEnum.Offline) {
              this.rootPage = 'LoginPage';
            }else{
              this.rootPage = 'NamePage'
            }
          }
        )
      }
      else {
        this.authService.loggedIn = false;
        this.isAuthenticated = false;
        this.rootPage = 'OfflinePage';
      }
    });

    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();
      timer(3000).subscribe(() =>{ this.showSplash = false; this.authService.splash = false})

    });
  }

  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot('LoginPage');
  }

  onSettings() {
    this.nav.push('SettingsPage');
  }

  onLoadOnline(){
    if(this.networkProvider.isOnline == true) {
      if (this.authService.loggedIn == false) {
        this.nav.setRoot('RegistrationPage');
      } else {
        this.nav.setRoot('HomePage')
      }
    }else{

    }
  }
}

