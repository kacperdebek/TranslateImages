import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  languages: any = [
    {
      "name": "English",
      "code": "en",
    },
    {
      "name": "Spanish",
      "code": "es",
    },
    {
      "name": "Russian",
      "code": "ru",
    },
    {
      "name": "French",
      "code": "fr",
    },
    {
      "name": "Polish",
      "code": "pl",
    },
    {
      "name": "German",
      "code": "de",
    }
  ];
  currentLoading;
  constructor(private route: ActivatedRoute, private insomnia: Insomnia, private mlkitTranslate: MLKitTranslate,
    public loadingController: LoadingController, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let json = JSON.parse(this.router.getCurrentNavigation().extras.state.text);
        this.text = json.blocks.blocktext.join(" ");
      }
    });
  }
  findLanguageByCode(code: string): string {
    for (let element of this.languages) {
      if (element.code === code) {
        return element.name;
      }
    }
    return "n/a";
  }
  findCodeByLanguageName(name: string): string {
    for (let element of this.languages) {
      if (element.name === name) {
        return element.code;
      }
    }
    return "n/a";
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.insomnia.allowSleepAgain()
      .then(
        () => console.log('success'),
        () => console.log('error')
      );
    this.detectLanguage().then(() => {
      this.translateSource();
    })
  }
  async detectLanguage() {
    await this.mlkitTranslate.identifyLanguage(this.text).then((lang) => {
      this.sourceLang = this.findLanguageByCode(lang.code);
    })
  }
  translateSource() {
    this.areModelsDownloaded().then(() => {
      this.mlkitTranslate.translate(this.text, this.findCodeByLanguageName(this.targetLang), this.findCodeByLanguageName(this.sourceLang)).then(translatedText => {
        this.translated = translatedText;
      })
    });
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
        if (availableModels.some(item => (item.code === this.findCodeByLanguageName(this.targetLang)) || this.targetLang === "English")) {
          if (availableModels.some(item => (item.code === this.findCodeByLanguageName(this.sourceLang)) || this.sourceLang === "English")) {
            areAvailable = 3;
          }
          else {
            areAvailable = 1;
          }
        }
        else if (availableModels.some(item => (item.code === this.findCodeByLanguageName(this.sourceLang)) || this.sourceLang === "English")) {
          areAvailable = 2;
        }
        else {
          areAvailable = 0;
        }
        return areAvailable;
      }).then(async (areAvailable) => {
        if (areAvailable !== 3) {
          loading.dismiss().then(async () => {
            const downloading = await this.loadingController.create({ message: 'Downloading models...' });
            downloading.present().then(() => {
              if (areAvailable === 1) {
                this.mlkitTranslate.downloadModel(this.findCodeByLanguageName(this.sourceLang)).finally(() => {
                  downloading.dismiss();
                })
              }
              else if (areAvailable === 2) {
                this.mlkitTranslate.downloadModel(this.findCodeByLanguageName(this.targetLang)).finally(() => {
                  downloading.dismiss();
                })
              }
              else if (areAvailable === 0) {
                this.mlkitTranslate.downloadModel(this.findCodeByLanguageName(this.targetLang)).then(() => {
                  this.mlkitTranslate.downloadModel(this.findCodeByLanguageName(this.sourceLang)).finally(() => {
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
