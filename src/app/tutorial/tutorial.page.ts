import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { MLKitTranslate } from '@ionic-native/mlkit-translate/ngx';
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})

export class TutorialPage {
  @ViewChild('slides') slides: IonSlides;
  slideOptions: any;
  confirmed: boolean = false;
  english: boolean;
  spanish: boolean;
  russian: boolean;
  french: boolean;
  polish: boolean;
  german: boolean;
  languages: any = [
    {
      "name": "english",
      "code": "en",
      "toggled": false,
      "downloaded": false
    },
    {
      "name": "spanish",
      "code": "es",
      "toggled": false,
      "downloaded": false
    },
    {
      "name": "russian",
      "code": "ru",
      "toggled": false,
      "downloaded": false
    },
    {
      "name": "french",
      "code": "fr",
      "toggled": false,
      "downloaded": false
    },
    {
      "name": "polish",
      "code": "pl",
      "toggled": false,
      "downloaded": false
    },
    {
      "name": "german",
      "code": "de",
      "toggled": false,
      "downloaded": false
    }
  ];
  constructor(private storage: Storage, private router: Router, public alertController: AlertController,
    private mlkitTranslate: MLKitTranslate) {

  }
  async finish() {
    await this.storage.set('tutorialComplete', true);
    this.router.navigateByUrl('/');
  }
  downloadModels() {
    this.slides.lockSwipes(true);
    let promiseStack = [];
    for (let lang of this.languages) {
      if (lang.toggled === true) {
        promiseStack.push(this.mlkitTranslate.downloadModel(lang.code).then(()=>{
          lang.downloaded = true;
        }));
      }
    }
    Promise.all(promiseStack).then(()=>{
      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
    })
  } //TODO: default languages selector
  confirm() {
    let success = false;
    for (let status of this.languages) {
      if (status.toggled === true) {
        this.confirmed = true;
        success = true;
        this.downloadModels();
        return;
      }
    }
    if (!success) {
      this.presentAlert();
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Info',
      message: 'Please select at least one language',
      buttons: ['OK']
    });
    await alert.present();
  }
  slideChanged(e: any) {
    this.slides.getActiveIndex().then((index: number) => {
      if (index === 1) {
        this.slides.lockSwipeToNext(true);
      } else if (index === 0) {
        this.slides.lockSwipeToNext(false);
      }
    });
  }
}
