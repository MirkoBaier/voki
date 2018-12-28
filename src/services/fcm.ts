import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {AngularFirestore} from "@angular/fire/firestore";
import {Firebase} from "@ionic-native/firebase";
import {NameService} from "./name";


@Injectable()
export class FcmProvider {

  constructor(private firebase: Firebase,
              private afs: AngularFirestore,
              private platform: Platform,
              private nameService: NameService) {

  }

  async getToken() {

    let token;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      // token = await this.firebaseNative.getToken();
      // await this.firebaseNative.grantPermission();
    }

    if (!this.platform.is('cordova')) {

    }

    return this.saveTokenToFirestore(token);
  }

  private saveTokenToFirestore(token) {

      if (!token) return;
      const devicesRef = this.afs.collection('devices');

      const docData = {
        token,
        userId: this.nameService.userId,
      };

      return devicesRef.doc(token).set(docData)
  }

  listenToNotifications() {
    return this.firebase.onNotificationOpen()
  }
}


