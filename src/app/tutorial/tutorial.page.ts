import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})

export class TutorialPage {
  @ViewChild('slides') slides: IonSlides;
  slideOptions: any;
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
      "toggled": false
    },
    {
      "name": "spanish",
      "code": "es",
      "toggled": false
    },
    {
      "name": "russian",
      "code": "ru",
      "toggled": false
    },
    {
      "name": "french",
      "code": "fr",
      "toggled": false
    },
    {
      "name": "polish",
      "code": "pl",
      "toggled": false
    },
    {
      "name": "german",
      "code": "de",
      "toggled": false
    }
  ];
  constructor(private storage: Storage, private router: Router, public alertController: AlertController) {

  }
  async finish() {
    await this.storage.set('tutorialComplete', true);
    this.router.navigateByUrl('/');
  }
  confirm() {
    let success = false;
    for (let status of this.languages) {
      if (status.toggled === true) {
        success = true;
        this.slides.lockSwipeToNext(false);
        this.slides.slideNext();
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
