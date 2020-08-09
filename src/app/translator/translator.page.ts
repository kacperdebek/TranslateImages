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
  translated:string = " ";
  constructor(private route: ActivatedRoute, private insomnia: Insomnia, private mlkitTranslate: MLKitTranslate) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.insomnia.allowSleepAgain()
    .then(
      () => console.log('success'),
      () => console.log('error')
    );
    let json = JSON.parse(this.route.snapshot.paramMap.get('text'));
    this.text = json.blocks.blocktext.join(" ");
    this.mlkitTranslate.translate(this.text, "pl", "en").then(translatedText=>{
      this.translated = translatedText;
  })
  }
}
