import { Component, ViewChild, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides } from 'ionic-angular';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the OfflineEasyModusGamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offline-easy-modus-game',
  templateUrl: 'offline-easy-modus-game.html',
  providers: [DragulaService]
})
export class OfflineEasyModusGamePage implements OnDestroy{
  
  public $todos = [];
  public subs = new Subscription();
  q1 = [];
  q2 = [];
 
 
  constructor(private navController: NavController,
              public alertCtrl: AlertController,
              private dragulaService: DragulaService) {

                
    for (var i = 0; i < 5; i++) {
      this.q1.push("1...." + i )
    }


     this.subs.add(dragulaService.drop('bag')
    .subscribe(({ el }) => {
      console.log("3", el);
    }))

    // this is to prevent 'bag already exists error'
    // https://github.com/valor-software/ng2-dragula/issues/442
    const bag: any = this.dragulaService.find('bag');
    if (bag !== undefined ) this.dragulaService.destroy('bag');

    dragulaService.createGroup('bag', {
      removeOnSpill: false
    });

    // this.$todos = ["hi","ho","was","geht"];  
    
    // this.dragulaService.createGroup('todos', {
    //     removeOnSpill: false
    //   });

    //   this.subs.add(dragulaService.drop('todos')
    // .subscribe(({ el }) => {
    //   this.position();
    // }))
  }

  position(){

  }

  ngOnInit(){
    console.log(this.$todos);
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
  }

  

