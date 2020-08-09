import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { MLKitTranslate } from '@ionic-native/mlkit-translate/ngx';

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
  constructor(private route: ActivatedRoute, private insomnia: Insomnia, private mlkitTranslate: MLKitTranslate) {
    this.map.set("polish", "pl");
    this.map.set("english", "en");
    this.map.set("russian", "ru");
    this.map.set("german", "de");
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
    this.mlkitTranslate.translate(this.text, this.map.get(this.targetLang.toLowerCase()), this.map.get(this.sourceLang.toLowerCase())).then(translatedText => {
      this.translated = translatedText;
    })
  }
}
