import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'


import {VokabelQuiz} from './app.component';
import {AuthService} from "../services/auth";
import { AngularFireAuthModule} from 'angularfire2/auth';
import { Network } from '@ionic-native/network';

import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {NameService} from "../services/name";
import {OneVoneService} from "../services/oneVone";
import {PointsService} from "../services/points";
import {VocubalarService} from "../services/vocubalar";
import {Firebase} from "@ionic-native/firebase";
import {FcmProvider} from "../services/fcm";
import {TrainingsService} from "../services/training";
import {NetworkService} from "../services/networkservice";
import { HttpClientModule } from '@angular/common/http';
import {GooglePlus} from "@ionic-native/google-plus";
import { CommonModule } from '@angular/common';
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {OfflineService} from "../services/offlineservice";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {OwnVocOnlineService} from "../services/ownVocOnlineService";
import { DragulaModule } from 'ng2-dragula';


var config = {
  apiKey: "AIzaSyBRSdQh2ebE4K8yaB9Gd3QeGmZoSB1DMw8",
  authDomain: "quiz-5e917.firebaseapp.com",
  databaseURL: "https://quiz-5e917.firebaseio.com",
  projectId: "quiz-5e917",
  storageBucket: "quiz-5e917.appspot.com",
  messagingSenderId: "301583012596"
};


@NgModule({
  declarations: [
    VokabelQuiz
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DragulaModule.forRoot(),
    IonicModule.forRoot(VokabelQuiz, {
      preloadModules: true // <- Here!
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    VokabelQuiz
  ],
  providers: [
    NativePageTransitions,
    GooglePlus,
    AuthService,
    StatusBar,
    SplashScreen,
    NameService,
    OneVoneService,
    PointsService,
    VocubalarService,
    Firebase,
    FcmProvider,
    TrainingsService,
    NetworkService,
    Network,
    OfflineService,
    OwnVocOnlineService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
