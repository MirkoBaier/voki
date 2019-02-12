import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';


export enum ConnectionStatusEnum {
  Online,
  Offline
}
@Injectable()
export class NetworkService {
  public previousStatus;
  public isOnline: boolean;

  constructor(public HttpClient: HttpClient,
              public alertCtrl: AlertController,
              public network: Network,
              public eventCtrl: Events) {
    console.log('Hello NetworkProvider Provider');
    this.previousStatus = ConnectionStatusEnum.Offline;
    this.isOnline = true;
  }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Online) {
        this.eventCtrl.publish('network:offline');
      }
      this.isOnline = false;
      this.previousStatus = ConnectionStatusEnum.Offline;
    });
    this.network.onConnect().subscribe(() => {
      // setTimeout(() => {
        if (this.previousStatus === ConnectionStatusEnum.Offline) {
          this.eventCtrl.publish('network:online');
        }
        this.isOnline = true;
        this.previousStatus = ConnectionStatusEnum.Online;
      // }, 300);
    });
  }

}
