import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { MLKitTranslate } from '@ionic-native/mlkit-translate/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.page.html',
  styleUrls: ['./translator.page.scss'],
})
export class TranslatorPage implements OnInit {
  text: string;
  translated: string = " ";
  sourceLang: string = "English";
  targetLang: string = "Polish";
  map: Map<string, string> = new Map<string, string>();
  currentLoading;
  constructor(private route: ActivatedRoute, private insomnia: Insomnia, private mlkitTranslate: MLKitTranslate, public loadingController: LoadingController) {
    this.map.set("polish", "pl");
    this.map.set("english", "en");
    this.map.set("russian", "ru");
    this.map.set("german", "de");
    this.map.set("french", "fr");
    this.map.set("spanish", "es");
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.insomnia.allowSleepAgain()
      .then(
        () => console.log('success'),
        () => console.log('error')
      );
    let json = JSON.parse(this.route.snapshot.paramMap.get('text'));
    this.text = json.blocks.blocktext.join(" ");
    this.translateSource();
  }
  translateSource() {
    this.areModelsDownloaded();
    this.mlkitTranslate.translate(this.text, this.map.get(this.targetLang.toLowerCase()), this.map.get(this.sourceLang.toLowerCase())).then(translatedText => {
      this.translated = translatedText;
    })
  }
  sourceChange($event) {
    this.translateSource()
  }
  targetChange($event) {
    this.translateSource()
  }
  async areModelsDownloaded() {
    const loading = await this.loadingController.create({ message: 'Loading...' });
    loading.present().then(() => {
      this.mlkitTranslate.getDownloadedModels().then(availableModels => {
        let areAvailable;
        if (availableModels.some(item => (item.code === this.map.get(this.targetLang.toLowerCase())))) {
          if (availableModels.some(item => (item.code === this.map.get(this.sourceLang.toLowerCase())))) {
            areAvailable = 3;
          }
          else {
            areAvailable = 1;
          }
        }
        else if (availableModels.some(item => (item.code === this.map.get(this.sourceLang.toLowerCase())))) {
          areAvailable = 2;
        }
        else {
          areAvailable = 0;
        }
        return areAvailable;
      }).then(async (areAvailable) => {
        if (areAvailable != 3) {
          loading.dismiss().then(async () => {
            const downloading = await this.loadingController.create({ message: 'Downloading models...' });
            downloading.present().then(() => {
              if (areAvailable === 1) {
                this.mlkitTranslate.downloadModel(this.map.get(this.sourceLang.toLowerCase())).then(() => {
                  downloading.dismiss();
                })
              }
              else if (areAvailable === 2) {
                this.mlkitTranslate.downloadModel(this.map.get(this.targetLang.toLowerCase())).then(() => {
                  downloading.dismiss();
                })
              }
              else if (areAvailable === 0) {
                this.mlkitTranslate.downloadModel(this.map.get(this.targetLang.toLowerCase())).then(() => {
                  this.mlkitTranslate.downloadModel(this.map.get(this.targetLang.toLowerCase())).then(() => {
                    downloading.dismiss();
                  })
                })
              }
            })
          });
        }
        else {
          loading.dismiss();
        }
      });
    });
  }
}
